import firebase from 'firebase';

export interface Backlog {
    id: string;
    pid: string;
    project: string;
    product: string;
    additionTask: string;
    module: string;
    date_start: string | Date | firebase.firestore.FieldValue | firebase.firestore.Timestamp;
    date_target: string | Date | firebase.firestore.FieldValue | firebase.firestore.Timestamp;
    date_finish: string | Date | firebase.firestore.FieldValue | firebase.firestore.Timestamp;
    activity: string;
    status: string;
    effort: string;
    blockers: string;
    createdAt: string | Date | firebase.firestore.FieldValue | firebase.firestore.Timestamp;
    updatedAt: string | Date | firebase.firestore.FieldValue | firebase.firestore.Timestamp;
}