"use client"

import { del, fetchList, uploadFile } from "@/app/db/sql"
import Table from "@/components/list-table"
import { QueryResultRow } from "@vercel/postgres"
import { Button, Upload, message } from "antd"
import { useEffect, useState } from "react"

export default function List() {
  const [data, setData] = useState<QueryResultRow[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchAndUpdateList = () => {
    setLoading(true)
    fetchList()
      .then((data) => {
        setData(data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAndUpdateList()
  }, [])

  return (
    <div>
      <div className="flex justify-end">
        <Upload
          showUploadList={false}
          customRequest={async (opt) => {
            const formData = new FormData()
            formData.set("file", opt.file)
            try {
              setSubmitting(true)
              await uploadFile(formData)
              message.success("上传成功")
              fetchAndUpdateList()
            } catch (e: any) {
              message.error(e?.message ?? "上传失败")
            } finally {
              setSubmitting(false)
            }
          }}
        >
          <Button loading={submitting}>上传文件</Button>
        </Upload>
      </div>
      <div className="mt-4">
        <Table
          data={data}
          loading={loading}
          del={del}
          refresh={fetchAndUpdateList}
        />
      </div>
    </div>
  )
}
