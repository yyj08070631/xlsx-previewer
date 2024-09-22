"use client"

import { DetailTable } from "@/components/detail-table"
import { detail } from "@/db/sql"
import { Radio, Space, message } from "antd"
import { useEffect, useMemo, useState } from "react"

export default function Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Record<string, any>>()
  const [loading, setLoading] = useState(false)
  const [viewType, setViewType] = useState("default")

  const viewData = useMemo(() => {
    if (viewType === "combination") {
      return {
        ...data,
        data: (data?.data || []).map((v: any) => ({
          ...v,
        })),
      }
    }
    return data
  }, [data, viewType])

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

  return (
    <Space direction="vertical">
      {/* <Radio.Group
        value={viewType}
        onChange={(e) => setViewType(e.target.value)}
      >
        <Radio value={"default"}>默认视图</Radio>
        <Radio value={"combination"}>产品聚合视图</Radio>
      </Radio.Group> */}
      <DetailTable row={data} loading={loading} />
    </Space>
  )
}
