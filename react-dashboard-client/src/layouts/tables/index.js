import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const createMyDataSource = (data) => {
  window.rowDataServerSide = data;
  return {
    getRows: (params) => {
      setTimeout(() => {
        // take a slice of the total rows
        const rowsThisPage = data.slice(params.request.startRow, params.request.endRow);
        // call the success callback
        params.success({
          rowData: rowsThisPage,
          rowCount: window.rowDataServerSide.length,
        });
      }, 500);
    },
  };
};

const getRowId = (params) => params.data.id;

const onRowValueChanged = (event) => {
  const data = event.data; // eslint-disable-line prefer-destructuring
  fetch(`http://localhost:5000/api/user/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password.toString(),
      role: data.role,
    }),
  });
};

class Tables extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { field: "email", width: 180 },
        { field: "password", width: 200 },
        { field: "role", width: 100 },
      ],
      defaultColDef: {
        width: 100,
        resizable: true,
        editable: true,
      },
      rowSelection: "single",
      rowModelType: "serverSide",
      editType: "fullRow",
    };
  }

  onGridReadyUsers = (params) => {
    this.gridApi = params.api;

    const updateData = (data) => {
      const datasource = createMyDataSource(data);
      params.api.setServerSideDatasource(datasource);
    };

    fetch("http://localhost:5000/api/user/")
      .then((resp) => resp.json())
      .then((data) => updateData(data));
  };

  onGridReadyBaskets = (params) => {
    this.gridApiBasket = params.api;

    const updateData = (data) => {
      const datasource = createMyDataSource(data);
      params.api.setServerSideDatasource(datasource);
    };

    fetch("http://localhost:5000/api/basket/")
      .then((resp) => resp.json())
      .then((data) => updateData(data));
  };

  onBtStartEditing = () => {
    const selectedRows = this.gridApi.getSelectedNodes();
    if (!selectedRows || selectedRows.length === 0) {
      alert("Выберите строку, над которой хотите произвести изменения");
      return;
    }
    const selectedRow = selectedRows[0];
    const indexToRemove = window.rowDataServerSide.indexOf(selectedRow.data);
    this.gridApi.setFocusedCell(indexToRemove, "email");
    this.gridApi.startEditingCell({
      rowIndex: indexToRemove,
      colKey: "email",
    });
  };

  onBtAdd = () => {
    // insert new row in the source data, at the top of the page
    const initUser = {
      email: `random${Math.ceil(Math.random() * 10000)}@mail.ru`,
      password: Math.ceil(Math.random() * 10000),
    };
    fetch("http://localhost:5000/api/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        email: initUser.email,
        password: initUser.password.toString(),
      }),
    })
      .then((resp) => resp.json())
      .then((user) => {
        window.rowDataServerSide.push({
          id: user.id,
          email: user.email,
          password: user.password,
          role: user.role,
        });
        this.gridApi.refreshServerSide();
        this.gridApiBasket.refreshServerSide();
      });
  };

  onBtRemove = () => {
    const selectedRows = this.gridApi.getSelectedNodes();
    if (!selectedRows || selectedRows.length === 0) {
      alert("Выберите строку, которая будет удалена");
      return;
    }
    const selectedRow = selectedRows[0];
    const indexToRemove = window.rowDataServerSide.indexOf(selectedRow.data);
    fetch(`http://localhost:5000/api/user/${selectedRow.id}`, { method: "DELETE" }).then((resp) => {
      if (resp.status === 200) {
        // the record could be missing, if the user hit the 'remove' button a few times before refresh happens
        if (indexToRemove >= 0) {
          window.rowDataServerSide.splice(indexToRemove, 1);
        }
        this.gridApiBasket.refreshServerSide();
        this.gridApi.refreshServerSide();
      }
    });
  };

  render() {
    return (
      <div style={{ marginLeft: "650px", width: "40%", height: "40%" }}>
        <div className="example-wrapper">
          <div style={{ marginBottom: "5px" }}>
            <button
              style={{ marginRight: "5px", cursor: "pointer" }}
              type="button"
              onClick={() => this.onBtAdd()}
            >
              Добавить запись
            </button>
            <button
              style={{ marginRight: "5px", cursor: "pointer" }}
              type="button"
              onClick={() => this.onBtStartEditing()}
            >
              Изменить
            </button>
            <button style={{ cursor: "pointer" }} type="button" onClick={() => this.onBtRemove()}>
              Удалить
            </button>
          </div>
          <div
            style={{
              height: "350px",
              width: "100%",
            }}
            className="ag-theme-alpine-dark"
          >
            <AgGridReact
              columnDefs={this.state.columnDefs} // eslint-disable-line react/destructuring-assignment
              defaultColDef={this.state.defaultColDef} // eslint-disable-line react/destructuring-assignment
              editType={this.state.editType} // eslint-disable-line react/destructuring-assignment
              rowSelection={this.state.rowSelection} // eslint-disable-line react/destructuring-assignment
              rowModelType={this.state.rowModelType} // eslint-disable-line react/destructuring-assignment
              serverSideInfiniteScroll
              onGridReady={this.onGridReadyUsers}
              getRowId={getRowId}
              onRowValueChanged={onRowValueChanged}
            />
            <div style={{ marginBottom: 100 }}> </div>
            <AgGridReact
              columnDefs={[
                { field: "sum", width: 150 },
                { field: "userId", width: 100 },
              ]}
              defaultColDef={{
                width: 100,
                resizable: true,
                editable: false,
              }}
              rowModelType="serverSide"
              serverSideInfiniteScroll
              onGridReady={this.onGridReadyBaskets}
              getRowId={getRowId}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Tables;
