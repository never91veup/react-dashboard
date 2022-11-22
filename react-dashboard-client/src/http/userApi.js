import { $host } from "./index";

export const getAll = async () => {
  const { data } = await $host.get("api/user")
  return data
}

export const create = async (email, password) => {
  const { data } = await $host.post('api/user', {email, password, role: "ADMIN"})
  return data
}

export const update = async (email, password) => {
  const { data } = await $host.patch('api/user/:id', {email, password})
  return data
}

export const del = async () => {
  const { data } = await $host.delete('api/user/:id')
  return data
}
