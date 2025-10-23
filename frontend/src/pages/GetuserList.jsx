import { useState } from "react";
import { data } from "react-router-dom";

function GetUserList() {
    const [users, setUsers] = useState(data)

    return (
        <div>
            <h1>회원 목록</h1>
        </div>
    )
}

export default GetUserList;