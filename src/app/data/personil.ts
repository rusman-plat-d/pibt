import { IPersonil, IPersonilByPid } from "../types/personil";

export const PERSONIL_BY_PID: IPersonilByPid = {
    1:  { pid: 1,   nama:'INDRIYANTO',                  panggilan:'Kim' },
    2:  { pid: 2,   nama:'NURIANA SANTIARA',            panggilan:'Nur' },
    3:  { pid: 3,   nama:'YUSUP SUPRIATNA',             panggilan:'Ucup' },
    4:  { pid: 4,   nama:'STEFANUS CHRISTIAN CAHYONO',  panggilan:'Stef' },
    5:  { pid: 5,   nama:'KALAM HADA PRATAMA',          panggilan:'Kalam' },
    6:  { pid: 6,   nama:'MOCHAMAD FAJAR SUADA',        panggilan:'Bang Alex' },
    8:  { pid: 8,   nama:'ABDUL WAHID',                 panggilan:'Wahid' },
    9:  { pid: 9,   nama:'ASEP NASIHIN',                panggilan:'Kumis / Kolot' },
    10: { pid: 10,  nama:'DESTA AHMAD PAHLEVI',         panggilan:'Desta' },
    11: { pid: 11,  nama:'ARFAN CITRA WIBOWO',          panggilan:'Arfan' },
    12: { pid: 12,  nama:'ANGGARA PRATAMA PUTRA',       panggilan:'Code Racer' },
    13: { pid: 13,  nama:'HADI HADIANSYAH',             panggilan:'Mang Hadi' },
    14: { pid: 14,  nama:'MUHAMMAD ADAM DZULQARNAIN',   panggilan:'Adam' },
    15: { pid: 15,  nama:'SANDI SURYADI',               panggilan:'Isur' },
    16: { pid: 16,  nama:'SANDI MULYADI',               panggilan:'Emul' },
    17: { pid: 17,  nama:'ABDUL HADI',                  panggilan:'Si Dul' },
    19: { pid: 19,  nama:'RUSMAN WAHAB',                panggilan:'Rusman' },
    20: { pid: 20,  nama:'MUHAMAD FAHMI SECHAN',        panggilan:'Sechan' },
    21: { pid: 21,  nama:'M. ANDRIAWAN RIDWAN',         panggilan:'Andri / wawan' },
    22: { pid: 22,  nama:'SATRIO',                      panggilan:'Tio' },
    23: { pid: 23,  nama:'KANG IMAT',                   panggilan:'Kang imat' },
};

export const PERSONIL: IPersonil[] = Object.values(PERSONIL_BY_PID);

export const PERSONIL_PID: number[] = PERSONIL.map(p=>p.pid);