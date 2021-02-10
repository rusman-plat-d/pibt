import firebase from 'firebase';

export interface Backlog {
    id: string;
    pid: string;
    project: string;
    product: string;
    additionTask: string;
    module: string;
    date_start: string | Date;
    date_target: string | Date;
    date_finish: string | Date;
    activity: string;
    status: string;
    effort: string;
    blockers: string;
    createdAt: string | Date | firebase.firestore.FieldValue;
    updatedAt: string | Date | firebase.firestore.FieldValue;
}