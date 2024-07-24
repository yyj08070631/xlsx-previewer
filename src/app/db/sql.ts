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

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const xlsx = require("xlsx")
  const workbook = xlsx.read(buffer)
  const sheetName = workbook.SheetNames[0]
  const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

  await db
    .insertInto("xlsxjson")
    .values({
      name: "babyboy",
      data: JSON.stringify(sheet),
      is_del: 0,
    })
    .execute()
}
