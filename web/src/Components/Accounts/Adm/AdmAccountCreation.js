import { React } from 'react';
import './AdmAccountCreation.css';

export default function AdmAccountCreation() {
    return (
        <div className='account-creation'>
            <div>
                <div>
                    <div>
                        <label>Prénom</label>
                    </div>
                    <input type="text" id="firstname" placeholder="John"/>
                </div>
                <div>
                    <div>
                        <label>Nom</label>
                    </div>
                    <input type="text" id="lastname" placeholder="Doe"/>
                </div>
                <div>
                    <div>
                        <label>Email</label>
                    </div>
                    <input type="email" id="email" placeholder="john.doe@example.com"/>
                </div>
            </div>
            <div className="creation-button">
                <button>Créer un compte</button>
            </div>
        </div>
    );
}