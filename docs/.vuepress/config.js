module.exports = {
  title: 'Analytics Engine',
  description: 'Just playing around',
  themeConfig: {
    nav: [
      { text: 'Home Page', link: '/' },
      {
        text: 'Reference Manual',
        link: '/reference-manual/',
        items: [
          { text: 'Cloudera', link: '/reference-manual/cloudera/' },
          { text: 'Grafana', link: '/reference-manual/grafana/' },
          { text: 'Prometheus', link: '/reference-manual/prometheus/' },
        ],
      },
    ],
    sidebar: {
      '/reference-manual/prometheus/':[
        '',
        'install',
      ],
      '/reference-manual/cloudera/':[
        '',
      ],
      '/reference-manual/grafana/':[
        '',
        'install'
      ],
  }
  }
}
