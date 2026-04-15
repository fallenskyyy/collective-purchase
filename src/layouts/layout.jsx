import { Outlet } from "react-router-dom";
import { Layout, Typography, Button } from "antd";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;


export default function MainLayout() {
  return (
    <>
    <Layout style={{ minHeight: "100vh" }}>

      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          <Button type="text" href="/">
            <Title style={{ color: "#fff", margin: 0 }} level={4}>
              GroupBuy
            </Title>
          </Button>

      <div style={{ display: "flex", gap: 16 }}>
        <Button style={{ color: "#fff"}} type="link" href="/catalog">Закупки</Button>
        <Button style={{ color: "#fff"}} type="link" href="/login">Профиль</Button>
      </div>

      </Header>

      <Outlet/>

      <Footer style={{ textAlign: "center" }}>
        GroupBuy © 2026
      </Footer>
    </Layout>
    </>
  );
}