import { React } from 'react';
import './AdmAccountCreation.css';

export default function AdmAccountCreation() {
    return (
        <div className='account-creation'>
            <div>
                <div>
                    <div>
                        <label>Prénom
                            <br/>
                            <input type="text" id="firstname" placeholder="John"/>
                        </label>
                    </div>
                </div>
                <div>
                    <div>
                        <label>Nom
                            <br />
                            <input type="text" id="lastname" placeholder="Doe"/>
                        </label>
                    </div>
                </div>
                <div>
                    <div>
                        <label>Email
                            <br/>
                            <input type="email" id="email" placeholder="john.doe@example.com"/>
                        </label>
                    </div>
                </div>
            </div>
            <div className="creation-button">
                <button>Créer un compte</button>
            </div>
        </div>
    );
}