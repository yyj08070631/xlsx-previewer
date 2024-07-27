"use client"

import { Button, Form, Input, Modal, message } from "antd"
import { useForm } from "antd/es/form/Form"
import { XUpload } from "./upload"
import { useEffect, useState } from "react"
import { add, edit } from "@/db/sql"

interface EditModalProps {
  visible?: boolean
  currRow?: any
  updateList?: Function
  setVisible?: Function
}
export const EditModal = ({
  visible,
  currRow,
  updateList,
  setVisible,
}: EditModalProps) => {
  const [form] = useForm()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (visible) {
      form.resetFields()
      form.setFieldsValue(currRow)
    }
  }, [visible, currRow])

  return (
    <Modal
      title="编辑表格"
      open={visible}
      footer={null}
      onCancel={() => setVisible?.(false)}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          try {
            setSubmitting(true)
            await edit({ id: currRow.id, ...values })
            message.success("编辑成功")
            updateList?.()
            setVisible?.(false)
          } catch (e: any) {
            message.error(e?.message ?? "编辑失败")
          } finally {
            setSubmitting(false)
          }
        }}
      >
        <Form.Item
          label={"表格名称"}
          name={["name"]}
          rules={[{ required: true, message: "请输入表格名称" }]}
        >
          <Input placeholder="请输入表格名称" />
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit" loading={submitting}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
