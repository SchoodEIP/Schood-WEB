import { translate } from "../../functions/sharedFunctions";

describe('translate function', () => {
    test('translates "other" to "Autre"', () => {
        expect(translate('other')).toBe('Autre');
    });

    test('translates "badcomportment" to "Contenu Offensant"', () => {
        expect(translate('badcomportment')).toBe('Contenu Offensant');
    });

    test('translates "bullying" to "Harcèlement"', () => {
        expect(translate('bullying')).toBe('Harcèlement');
    });

    test('translates "spam" to "Spam"', () => {
        expect(translate('spam')).toBe('Spam');
    });

    test('translates "teacher" to "Professeur"', () => {
        expect(translate('teacher')).toBe('Professeur');
    });

    test('translates "administration" to "Administrateur Scolaire"', () => {
        expect(translate('administration')).toBe('Administrateur Scolaire');
    });

    test('translates "student" to "Élève"', () => {
        expect(translate('student')).toBe('Élève')
    })

})