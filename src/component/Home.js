import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px'
        }}>
            <h1 style={{ margin: 0, fontSize: '60px' }}>진토이즘</h1>
            <Link to="/camera"><button style={{ fontSize: '23px', border: 'none', padding: '12px 18px', borderRadius: '10px', backgroundColor: 'steelblue', color: 'white', boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}>촬영하기</button></Link>
        </div>
    )
}
