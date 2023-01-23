
async function initCytoscape(domain){

    const response = await fetch('https://get-graph-32yvifrm4a-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"domain": domain})
    });
    const data = await response.json();
    window.nameserver_data = data;
    window.showSupplyChain();
    let nodes = []
    let edges = []
    let clusters = []
    let tempClusters = {}
    for (const node_name in data["nameservers"]["nodes"]){
        nodes.push({ data: { id: node_name } })
        if (node_name != "."){
            let broken = node_name.split(".");
            if (tempClusters[broken[broken.length - 2]]){
                tempClusters[broken[broken.length - 2]].push(node_name)
            }else{
                tempClusters[broken[broken.length - 2]] = [node_name]
            }
        }
    }
    for (const values in tempClusters){
        clusters.push(tempClusters[values]);
    }
    for (const edge_name in data["nameservers"]["edges"]){
        const edge = data["nameservers"]["edges"][edge_name];

        edges.push({ data: { id: edge_name, weight: 5, source: edge["from"], target: edge["to"]}})
    }
    window.edges = edges;

    var cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,
      autounselectify: true,

      style: cytoscape.stylesheet()
        .selector('node')
          .style({
            'content': 'data(id)'
          })
        .selector('edge')
          .style({
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'width': 4,
            'line-color': '#ddd',
            'target-arrow-color': '#ddd'
          })
        .selector('.highlighted')
          .style({
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
          }),

      elements: {
          nodes: nodes,
          edges: edges
        },

      layout: {
        "name":  "cise",//"breadthfirst",//"dagre"
        "roots": ["ly."],
        allowNodesInsideCircle: true,
        nodeSeparation: 20,
        "clusters": clusters
      }

   });
   function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

   for (cluster of clusters){
        let color = getRandomColor();
        for(node_id of cluster){
            cy.nodes("[id = \"" + node_id + "\"]").style('background-color', color);
        }
   }

/*
      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: '#.',
        padding: 10
      }


      layout: { 

            "name": 'cose',
            "gravity": 0.000001,
            initialTemp: 100000,
            nodeRepulsion: function( node ){ return 100000048; },

      }
    });
    
    var bfs = cy.elements().bfs('#.', function(){}, true);

    var i = 0;
    var highlightNextEle = function(){
      if( i < bfs.path.length ){
        bfs.path[i].addClass('highlighted');

        i++;
        setTimeout(highlightNextEle, 1000);
      }
    };

    // kick off first highlight
    highlightNextEle();
    */
}

window.plotDomain = async function(){
    const domain = document.getElementById("getDomain").value;
    initCytoscape(domain);
}
