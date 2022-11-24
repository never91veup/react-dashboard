/* eslint-disable */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-enterprise';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import './styles.css';

const Tables = () => {

  const gridRefUser = useRef();

  const gridRefBasket = useRef();

  const [rowDataUser, setRowDataUser] = useState([]);

  const [rowDataBasket, setRowDataBasket] = useState([]);

  const [columnDefsUser] = useState([
    { field: "email", width: 180 },
    { field: "password", width: 200 },
    { field: "role", width: 100 },
  ]);

  const [defaultColDefUser] = useState({
    width: 100,
    resizable: true,
    editable: true,
  });

  const [columnDefsBasket] = useState([
    { field: "sum", width: 150 },
    { field: "userId", width: 100 },
  ]);

  const [defaultColDefBasket] = useState({
    width: 100,
    resizable: true,
    editable: false,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/user/").then(result => result.json()).then((rowDataUser) => setRowDataUser(rowDataUser));
    fetch("http://localhost:5000/api/basket/").then(result => result.json()).then((rowDataBasket) => setRowDataBasket(rowDataBasket));
  }, []);

  const onRowValueChanged = useCallback((event) => {
    const data = event.data;
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
    setRowDataUser(rowDataUser);
  }, [rowDataUser]);

  const onBtStartEditing = useCallback(() => {
    const selectedRowNodes = gridRefUser.current.api.getSelectedNodes();
    if (!selectedRowNodes || selectedRowNodes.length === 0) {
      alert("Выберите строку, над которой хотите произвести изменения");
      return;
    }
    const selectedRowNode = selectedRowNodes[0];
    const indexToRemove = rowDataUser.indexOf(selectedRowNode.data);
    gridRefUser.current.api.setFocusedCell(indexToRemove, "email");
    gridRefUser.current.api.startEditingCell({
      rowIndex: indexToRemove,
      colKey: "email",
    });
  }, [rowDataUser]);

  const onBtAdd = useCallback(() => {

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
        const newDataUser = [...rowDataUser, user];
        setRowDataUser(newDataUser);
        fetch("http://localhost:5000/api/basket/")
          .then(result => result.json())
          .then((rowDataBasket) => {
            setRowDataBasket(rowDataBasket);
          });
      });
  }, [rowDataUser, rowDataBasket]);

  const onBtRemove = useCallback(() =>  {
    const selectedRowNodes = gridRefUser.current.api.getSelectedNodes();
    const selectedRowNode = selectedRowNodes[0];
    if (!selectedRowNodes || selectedRowNodes.length === 0) {
      alert("Выберите строку, которая будет удалена");
      return;
    }
    fetch(`http://localhost:5000/api/user/${selectedRowNode.data.id}`,{
      method: "DELETE",
    })
      .then((resp) => {
        if (resp.status === 200) {
          const filteredDataUser = rowDataUser.filter(function (userDataItem) {
            return String((selectedRowNode.data.id)).indexOf(userDataItem.id) < 0;
          });
          const filteredDataBasket = rowDataBasket.filter(function (basketDataItem) {
            return String((selectedRowNode.data.id)).indexOf(basketDataItem.userId) < 0;
          });
          setRowDataUser(filteredDataUser);
          setRowDataBasket(filteredDataBasket);
        }
    });
  }, [rowDataUser, rowDataBasket]);

  return (
    <div className="ag-theme-alpine" style={{marginLeft: "500px", height: 400, width: 600}}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button
            style={{ marginRight: "5px", cursor: "pointer" }}
            type="button"
            onClick={() => onBtAdd()}
          >
            Добавить запись
          </button>
          <button
            style={{ marginRight: "5px", cursor: "pointer" }}
            type="button"
            onClick={() => onBtStartEditing()}
          >
            Изменить
          </button>
          <button style={{ cursor: "pointer" }} type="button" onClick={() => onBtRemove()}>
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
            ref={gridRefUser}
            rowData={rowDataUser}
            columnDefs={columnDefsUser}
            defaultColDef={defaultColDefUser}
            rowSelection={"single"}
            editType={"fullRow"}
            serverSideInfiniteScroll
            onRowValueChanged={onRowValueChanged}
          >
          </AgGridReact>
          <div style={{ marginBottom: 100 }}> </div>
          <AgGridReact
            ref={gridRefBasket}
            rowData={rowDataBasket}
            columnDefs={columnDefsBasket}
            defaultColDef={defaultColDefBasket}
            serverSideInfiniteScroll
          >
          </AgGridReact>
        </div>
      </div>
    </div>
  );
};


export default Tables;

// import React, { Component } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-enterprise";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
//
// const createMyDataSource = (data) => {
//   window.rowDataServerSide = data;
//
//   return {
//     getRows: (params) => {
//       setTimeout(() => {
//         // take a slice of the total rows
//         const rowsThisPage = [
//           ...data.users.slice(params.request.startRow, params.request.endRow),
//           ...data.baskets.slice(params.request.startRow, params.request.endRow),
//         ];
//         // const rowsThisPageBasket = data.baskets.slice(
//         //   params.request.startRow,
//         //   params.request.endRow
//         // );
//         // call the success callback
//         params.success({
//           rowData: rowsThisPage,
//           rowCount: window.rowDataServerSide.users.length,
//         });
//       }, 500);
//     },
//   };
// };
//
// // const onGridReadyPass = () => {};
//
// const getRowId = (params) => params.data.id;
//
// const onRowValueChanged = (event) => {
//   const data = event.data; // eslint-disable-line prefer-destructuring
//   fetch(`http://localhost:5000/api/user/${data.id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify({
//       email: data.email,
//       password: data.password.toString(),
//       role: data.role,
//     }),
//   });
// };
//
// class Tables extends Component {
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       columnDefs: [
//         { field: "email", width: 180 },
//         { field: "password", width: 200 },
//         { field: "role", width: 100 },
//       ],
//       defaultColDef: {
//         width: 100,
//         resizable: true,
//         editable: true,
//       },
//       rowSelection: "single",
//       rowModelType: "serverSide",
//       editType: "fullRow",
//     };
//   }
//
//   onGridReady = (params) => {
//     this.gridApi = params.api;
//     const dts = {
//       users: [],
//       baskets: [],
//     };
//
//     const updateData = (data) => {
//       const datasource = createMyDataSource(data);
//       params.api.setServerSideDatasource(datasource);
//     };
//
//     fetch("http://localhost:5000/api/user/")
//       .then((resp) => resp.json())
//       .then((data) => {
//         dts.users = data;
//       }); // eslint-disable-line
//
//     fetch("http://localhost:5000/api/basket/")
//       .then((resp) => resp.json())
//       .then((data) => {
//         dts.baskets = data;
//         updateData(dts);
//       });
//   };
//
//   onBtStartEditing = () => {
//     const selectedRows = this.gridApi.getSelectedNodes();
//     if (!selectedRows || selectedRows.length === 0) {
//       alert("Выберите строку, над которой хотите произвести изменения");
//       return;
//     }
//     const selectedRow = selectedRows[0];
//     const indexToRemove = window.rowDataServerSide.indexOf(selectedRow.data);
//     this.gridApi.setFocusedCell(indexToRemove, "email");
//     this.gridApi.startEditingCell({
//       rowIndex: indexToRemove,
//       colKey: "email",
//     });
//   };
//
//   onBtAdd = () => {
//     // insert new row in the source data, at the top of the page
//     const initUser = {
//       email: `random${Math.ceil(Math.random() * 10000)}@mail.ru`,
//       password: Math.ceil(Math.random() * 10000),
//     };
//     fetch("http://localhost:5000/api/user/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json;charset=utf-8",
//       },
//       body: JSON.stringify({
//         email: initUser.email,
//         password: initUser.password.toString(),
//       }),
//     })
//       .then((resp) => resp.json())
//       .then((user) => {
//         window.rowDataServerSide.push({
//           id: user.id,
//           email: user.email,
//           password: user.password,
//           role: user.role,
//         });
//         // ts-ignore
//         this.gridApi.refreshServerSide();
//       });
//   };
//
//   onBtRemove = () => {
//     const selectedRows = this.gridApi.getSelectedNodes();
//     if (!selectedRows || selectedRows.length === 0) {
//       alert("Выберите строку, которая будет удалена");
//       return;
//     }
//     const selectedRow = selectedRows[0];
//     const indexToRemove = window.rowDataServerSide.indexOf(selectedRow.data);
//     fetch(`http://localhost:5000/api/user/${selectedRow.id}`, { method: "DELETE" }).then((resp) => {
//       if (resp.status === 200) {
//         // the record could be missing, if the user hit the 'remove' button a few times before refresh happens
//         if (indexToRemove >= 0) {
//           window.rowDataServerSide.splice(indexToRemove, 1);
//         }
//         // ts-ignore
//         this.gridApi.refreshServerSide();
//       }
//     });
//   };
//
//   render() {
//     return (
//       <div style={{ marginLeft: "650px", width: "40%", height: "40%" }}>
//         <div className="example-wrapper">
//           <div style={{ marginBottom: "5px" }}>
//             <button
//               style={{ marginRight: "5px", cursor: "pointer" }}
//               type="button"
//               onClick={() => this.onBtAdd()}
//             >
//               Добавить запись
//             </button>
//             <button
//               style={{ marginRight: "5px", cursor: "pointer" }}
//               type="button"
//               onClick={() => this.onBtStartEditing()}
//             >
//               Изменить
//             </button>
//             <button style={{ cursor: "pointer" }} type="button" onClick={() => this.onBtRemove()}>
//               Удалить
//             </button>
//           </div>
//           <div
//             style={{
//               height: "350px",
//               width: "100%",
//             }}
//             className="ag-theme-alpine-dark"
//           >
//             <AgGridReact
//               columnDefs={this.state.columnDefs} // eslint-disable-line react/destructuring-assignment
//               defaultColDef={this.state.defaultColDef} // eslint-disable-line react/destructuring-assignment
//               editType={this.state.editType} // eslint-disable-line react/destructuring-assignment
//               rowSelection={this.state.rowSelection} // eslint-disable-line react/destructuring-assignment
//               rowModelType={this.state.rowModelType} // eslint-disable-line react/destructuring-assignment
//               serverSideInfiniteScroll
//               onGridReady={this.onGridReady}
//               getRowId={getRowId}
//               onRowValueChanged={onRowValueChanged}
//             />
//             <div style={{ marginBottom: 100 }}> </div>
//             <AgGridReact
//               columnDefs={[
//                 { field: "sum", width: 150 },
//                 { field: "userId", width: 100 },
//               ]}
//               defaultColDef={{
//                 width: 100,
//                 resizable: true,
//                 editable: false,
//               }}
//               rowModelType="serverSide"
//               serverSideInfiniteScroll
//               onGridReady={this.onGridReady}
//               getRowId={getRowId}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }
// }