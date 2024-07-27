"use client"

import { DetailTable } from "@/components/detail-table"
import { detail } from "@/db/sql"
import { message } from "antd"
import { useEffect, useState } from "react"

export default function Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Record<string, any>>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    detail(params.id)
      .then((data) => {
        setData(data)
        document.title = data.name
      })
      .catch((e: any) => message.error(e?.message ?? "获取数据失败"))
      .finally(() => setLoading(false))
  }, [params])

  return <DetailTable row={data} loading={loading} />
}
