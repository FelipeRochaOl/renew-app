"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEARNING_PATHS = void 0;
exports.LEARNING_PATHS = [
    {
        id: "lp-sec-update",
        title: "Atualização em Segurança Eletrônica",
        description: "Aprimore sua atuação com CFTV IP, controle de acesso e noções de analytics.",
        targetProfession: "Segurança de Shopping",
        forCurrentProfession: true,
        level: "BEGINNER",
        modules: [
            {
                id: "m1",
                title: "Fundamentos de CFTV IP",
                durationHours: 8,
                skills: ["CFTV", "Redes básicas"],
                externalLink: "https://www.coursera.org",
            },
            {
                id: "m2",
                title: "Controle de Acesso e Alarmes",
                durationHours: 6,
                skills: ["Acesso", "Alarmes"],
            },
        ],
    },
    {
        id: "lp-sec-transition-ops",
        title: "Transição para Operador de Monitoramento",
        description: "Migre para operação de monitoramento remoto e videowall.",
        targetProfession: "Operador de CFTV",
        forCurrentProfession: false,
        level: "INTERMEDIATE",
        modules: [
            {
                id: "m3",
                title: "Operação de Sistemas de Monitoramento",
                durationHours: 10,
                skills: ["Painéis", "Procedimentos"],
            },
            {
                id: "m4",
                title: "Noções de Analytics por IA",
                durationHours: 6,
                skills: ["Analytics", "Eventos automáticos"],
            },
        ],
    },
    {
        id: "lp-driver-update",
        title: "Digital para Entregadores",
        description: "Ferramentas de roteirização, apps e telemetria para elevar produtividade.",
        targetProfession: "Motorista de Entrega",
        forCurrentProfession: true,
        level: "BEGINNER",
        modules: [
            {
                id: "m5",
                title: "Apps de Roteiro",
                durationHours: 4,
                skills: ["Roteirização"],
            },
            {
                id: "m6",
                title: "Boas práticas de entrega",
                durationHours: 4,
                skills: ["Atendimento"],
            },
        ],
    },
    {
        id: "lp-cashier-transition",
        title: "Transição para Atendimento e Prevenção de Perdas",
        description: "Da operação de caixa para atendimento, estoque e prevenção de perdas.",
        targetProfession: "Atendente de Loja",
        forCurrentProfession: false,
        level: "BEGINNER",
        modules: [
            {
                id: "m7",
                title: "Atendimento ao Cliente",
                durationHours: 6,
                skills: ["Comunicação"],
            },
            {
                id: "m8",
                title: "Prevenção de Perdas 101",
                durationHours: 6,
                skills: ["Procedimentos"],
            },
        ],
    },
];
