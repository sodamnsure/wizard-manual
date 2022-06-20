module.exports = [
    {
        title: "Cloudera",
        directoryPath: "cloudera/",
        initialOpenGroupIndex: -1,
        children: [
            {
                title: "Requirements",
                directoryPath: "requirements/",
                initialOpenGroupIndex: -1,
                children: [
                    "operating-system-requirements",
                    "database-requirements",
                ],
                sidebarDepth: 2,
            },
            {
                title: "Installation",
                directoryPath: "installation/",
                initialOpenGroupIndex: -1,
                children: [
                    "before-you-install",
                    "installing-cloudera-manager-and-cdh",
                ],
                sidebarDepth: 2,
            },
        ],
    },
    {
        title: "Grafana",
        directoryPath: "grafana/",
        initialOpenGroupIndex: -1,
        children: [
            "install",
        ],
    },
    {
        title: "Prometheus",
        directoryPath: "prometheus/",
        initialOpenGroupIndex: -1,
        children: [
            "install",
        ],
    },
];