import { City } from "../type";

export const STEPS = [
    { id: 1, title: "Personal" },
    { id: 2, title: "Professional" },
    { id: 3, title: "Login" },
];

export const DUMMY = {
    states: [
        "UP", "Maharastra", "Delhi"
    ],
    cities: {
        UP: [
            { id: "Lucknow", name: "Lucknow" },
            { id: "Varanasi", name: "Varanasi" },
        ],
        DL: [
            { id: "NewDelhi", name: "New Delhi" },
            { id: "KarolBagh", name: "Karol Bagh" },
        ],
    } as Record<string, City[]>,
    departments: ["General Medicine", "Pediatrics", "Orthopedics", "Dentistry"],
    qualifications: ["MBBS", "BDS", "BSc Nursing", "Pharmacy", "Physiotherapy"],
    availabilities: ["Weekdays", "Weekends", "Both"],
    shifts: ["Morning", "Afternoon", "Evening", "Night"],
    titles: ["Mr", "Mrs", "Ms", "Dr"],
    genders: ["Male", "Female", "Other"],
};