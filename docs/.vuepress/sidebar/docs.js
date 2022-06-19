module.exports = [
    {
        title: "Cloudera",
        directoryPath: "cloudera/",
        initialOpenGroupIndex: -1,
        children: [
            "desc",
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
            {
                title: "Test",
                directoryPath: "test/",
                initialOpenGroupIndex: -1,
                children: [
                  "install",
                ],
                sidebarDepth: 2,
              },
        ],
    },
];