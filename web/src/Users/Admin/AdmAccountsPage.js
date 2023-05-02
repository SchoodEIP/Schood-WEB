import React from "react";
import HeaderComp from "../../Components/Header/HeaderComp";
import Sidebar from '../../Components/AdminMenu/index';
import AdmAccountsTable from "../../Components/Accounts/Adm/AdmAccountsTable.js";
import "./AdmAccountsPage.css";

export default function AdmAccountsPage() {
    return (
        <div>
            <div>
                <HeaderComp/>
            </div>
            <div className="page-body">
                <div className="left-half">
                    <Sidebar />
                </div>
                <div className="right-half">
                    <AdmAccountsTable />
                </div>
            </div>
        </div>
    );
}