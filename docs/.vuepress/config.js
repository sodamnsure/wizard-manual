function convertSidebar(list, path) {
  if (list.length > 0) {
    list.forEach((element, i) => {
      if (element.children) {
        convertSidebar(element.children, path + element.directoryPath);
        delete element.directoryPath;
      } else {
        list[i] = `${path}${element}`;
      }
    });
  }
  return list;
}

module.exports = {
  title: 'Manual',
  description: 'Just playing around',
  themeConfig: {
    nav: [
      {
        text: "Reference Manual",
        link: "/reference-manual/cloudera/system-requirements",
      },
      {
        text: "Data Integration",
        link: "/data-integration/goldengate/ogg-for-big-data",
      },
      {
        text: "Analytics Engine",
        link: "/analytics-engine/desc",
      },
      {
        text: "Data Warehouse",
        link: "/data-warehouse/dimensional-modeling/overview-of-dimension-modeling",
      },
    ],
    sidebar: {
      "/reference-manual/": convertSidebar(
        require("./sidebar/reference-manual.js"),
        "/reference-manual/"
      ),
      "/data-integration/": convertSidebar(
        require("./sidebar/data-integration.js"),
        "/data-integration/"
      ),
      "/data-warehouse/": convertSidebar(
        require("./sidebar/data-warehouse.js"),
        "/data-warehouse/"
      ),
    },
  },
  markdown: {
    lineNumbers: true,
    extractHeaders: ['h1'],
  },
}
