import { useEffect, useState } from "react";
import './AdmAccountsTable.css';

export default function AdmAccountsTable() {
    const [accountList, setAccountList] = useState([]); // list of accounts

    // get request for account list
    async function getAccountList() {
        // const baseUrl = "http://localhost:3000/administration/admin";
        // const token = sessionStorage.getItem("token");

        // const resp = await fetch(baseUrl, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         "x-auth-token": token,
        //     }
        // })
        // const data = await resp.json();
        // if (resp.status === 200) {
        //     console.log(data)
        //     console.log(resp.statusText);
        // } else {
        //     console.log(resp)
        //     console.log(resp.statusText);
        // }
        const data = [
            {
                'firstName': 'Harry',
                'lastName': 'Dresden',
                'email': 'harry.dresden@epitech.eu'
            },
            {
                'firstName': 'John',
                'lastName': 'Wick',
                'email': 'john.wick@epitech.eu'
            }
        ];
        setAccountList(data);
    }

    // account list request on mounted
    useEffect(() => {
        getAccountList();
    },[]);

    return (
        <div className="AccountsTable">
            <div id="tableBlock">
                <table id="accountTable">
                    <thead id="tableHead">
                    <tr id="topTable">
                        <th id="valHead1">Prénom</th>
                        <th id="valHead2">Nom</th>
                        <th id="valHead3">Email</th>
                    </tr>
                    </thead>
                    <tbody id="tableBody">
                    {
                        accountList.map((data, index) =>
                            <tr key={index}>
                                <td>{data.firstName}</td>
                                <td>{data.lastName}</td>
                                <td>{data.email}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
