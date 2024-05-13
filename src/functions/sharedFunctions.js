export function disconnect () {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('id')
    localStorage.removeItem('profile')
    sessionStorage.removeItem('id')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('profile')
    window.location.href = '/'
}

export function translate(word) {
    if (word === 'other')
        return 'Autre'
    else if (word === 'badcomportment')
        return 'Contenu Offensant'
    else if (word === 'bullying')
        return 'Harcèlement'
    else if (word === 'spam')
        return 'Spam'
    else if (word === 'teacher')
        return 'Professeur'
    else if (word === 'administration')
        return 'Administrateur Scolaire'
    else if (word === 'student')
        return 'Élève'
}