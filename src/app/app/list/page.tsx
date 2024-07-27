"use client"

import { del, fetchList } from "@/db/sql"
import Table from "@/components/list-table"
import { QueryResultRow } from "@vercel/postgres"
import { Button, Upload, message } from "antd"
import { useEffect, useState } from "react"
import { AddModal } from "@/components/add-modal"
import { EditModal } from "@/components/edit-modal"

export default function List() {
  const [data, setData] = useState<QueryResultRow[]>([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

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
        <Button type="primary" onClick={() => setVisible(true)}>
          新增表格
        </Button>
      </div>
      <div className="mt-4">
        <Table
          data={data}
          loading={loading}
          del={del}
          refresh={fetchAndUpdateList}
        />
      </div>
      <AddModal
        visible={visible}
        refresh={fetchAndUpdateList}
        setVisible={setVisible}
      />
    </div>
  )
}
