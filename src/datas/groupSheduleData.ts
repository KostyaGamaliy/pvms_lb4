const groupScheduleData = [
    {
        group: "ПЗПІ-20-7",
        sheduleData: [
            {
                date: new Date(),
                data: [
                    {
                        subject: "Математика",
                        educator: "Иванова",
                        time: "9:00 - 10:30"
                    },
                    {
                        subject: "Физика",
                        educator: "Петров",
                        time: "11:00 - 12:30"
                    },
                    {
                        subject: "История",
                        educator: "Сидоров",
                        time: "10:00 - 11:30"
                    },
                    {
                        subject: "Химия",
                        educator: "Кузнецова",
                        time: "9:30 - 11:00"
                    }
                ],
            },
            {
                date: new Date(new Date().setDate(new Date().getDate() - 1)),
                data: [
                    {
                        subject: "История",
                        educator: "Сидоров",
                        time: "10:00 - 11:30"
                    },
                    {
                        subject: "Химия",
                        educator: "Кузнецова",
                        time: "9:30 - 11:00"
                    }
                ]
            },
            {
                date: new Date(new Date().setDate(new Date().getDate() + 1)),
                data: [
                    {
                        subject: "Химия",
                        educator: "Кузнецова",
                        time: "9:30 - 11:00"
                    },
                    {
                        subject: "Химия",
                        educator: "Кузнецова",
                        time: "9:30 - 11:00"
                    },
                    {
                        subject: "История",
                        educator: "Сидоров",
                        time: "10:00 - 11:30"
                    }
                ]
            }
        ]
    },
    {
        group: "ПЗПІ-20-6",
        sheduleData: [
            {
                date: new Date(),
                data: [
                    {
                        subject: "История",
                        educator: "Сидоров",
                        time: "10:00 - 11:30"
                    },
                    {
                        subject: "Химия",
                        educator: "Кузнецова",
                        time: "9:30 - 11:00"
                    }
                ],
            },
            {
                date: new Date(new Date().setDate(new Date().getDate() - 1)),
                data: [
                    {
                        subject: "История",
                        educator: "Сидоров",
                        time: "10:00 - 11:30"
                    },
                    {
                        subject: "Химия",
                        educator: "Кузнецова",
                        time: "9:30 - 11:00"
                    },
                    {
                        subject: "Физика",
                        educator: "Петров",
                        time: "11:00 - 12:30"
                    },
                ]
            },
            {
                date: new Date(new Date().setDate(new Date().getDate() + 1)),
                data: [
                    {
                        subject: "История",
                        educator: "Сидоров",
                        time: "10:00 - 11:30"
                    }
                ]
            }
        ]
    }
];

export default groupScheduleData;