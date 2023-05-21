import React from "react";
import HeaderComp from "../../Components/Header/HeaderComp";
import Sidebar from '../../Components/AdminMenu/index';
import AdmAccountsTable from "../../Components/Accounts/Adm/AdmAccountsTable.js";
import AdmAccountCreation from "../../Components/Accounts/Adm/AdmAccountCreation.js";
import "./AdmAccountsPage.css";

export default function AdmAccountsPage() {
    return (
        <div>
            <div>
                <HeaderComp/>
            </div>
            <div className="page-body" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  height: '100vh',
                }}>
                <div className="left-half" style={{gridColumn: '1 / 2'}}>
                    <Sidebar />
                </div>
                <div className="center-half"style={{gridColumn: '2 / 3'}}>
                    <AdmAccountsTable />
                </div>
                <div className="right-half"style={{gridColumn: '3 / 4'}}>
                    <AdmAccountCreation />
                </div>
            </div>
        </div>
    );
}