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
  title: 'Analytics Engine',
  description: 'Just playing around',
  themeConfig: {
    nav: [
      {
        text: "Reference Manual",
        link: "/reference-manual/prometheus/install",
      },
    ],
    sidebar: {
      "/reference-manual/": convertSidebar(
        require("./sidebar/docs.js"),
        "/reference-manual/"
      ),
    },
  }
}
