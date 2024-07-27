import { Button } from "antd"

export default function Home() {
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <Button href="/app/list" type="primary">
        enter xlsx-previwer
      </Button>
    </div>
  )
}
