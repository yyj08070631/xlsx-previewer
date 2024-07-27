"use server"

import { sql } from "@vercel/postgres"
import { createKysely } from "@vercel/postgres-kysely"

const db = createKysely<{ xlsxjson: any }>()

export const fetchList = async () => {
  const { rows } =
    await sql`SELECT * FROM XLSXJSON WHERE is_del IS NULL OR is_del != 1;`
  return rows
}

export const del = async (id: string) => {
  return await sql`UPDATE XLSXJSON
SET is_del = 1
WHERE id = ${id};`
}

export async function add(formData: FormData) {
  const file = formData.get("file") as File
  const name = formData.get("name")
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const xlsx = require("xlsx")
  const workbook = xlsx.read(buffer)
  const sheetName = workbook.SheetNames[0]
  const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

  await db
    .insertInto("xlsxjson")
    .values({
      name,
      data: JSON.stringify(sheet),
      is_del: 0,
    })
    .execute()
}

export const detail = async (id: string) => {
  const result = await db
    .selectFrom("xlsxjson")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirstOrThrow() // 使用 executeTakeFirstOrThrow 以便在找不到记录时抛出错误

  return result
}

export const edit = async (row: any) => {
  return await sql`UPDATE XLSXJSON
SET name = ${row.name}
WHERE id = ${row.id};`
}
