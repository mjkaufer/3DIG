

      var container;
      var camera, scene, renderer, group,controls, count, particles;

      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;
      var start = Date.now();
      var autoControl = true;

      var cmat;

      var intervalID;
      var spazz = false;
      var mouseX = -1, mouseY = -1;


      window.onload = function(){
        if(isMobile())
          alert('This will probably not work on your mobile phone. Please try this on a desktop.');
	      init();
	      animate();
	      $('#it').val(plotRandom());
		  $('#it').on('input',function(){plot();console.log('a')});
      }

  function toggleSpazz(){
    if(spazz)
      clearInterval(intervalID);
    else
      intervalID = setInterval(function(){plotRandom()}, 100);
    spazz = !spazz;
  }

  function toggleControls(){
    if(!autoControl)
      group.rotation.y = group.rotation.x = group.rotation.z = 0;

    autoControl = !autoControl;
  }  

  function addCube(x, y, z, col){
    var size = 100;
    var g = new THREE.CubeGeometry( size, size, size );
    // var m = new THREE.MeshBasicMaterial({color:col});
    var mesh = new THREE.Mesh(g, cmat);
    group.add(mesh);
    mesh.position = new THREE.Vector3(x * size, y * size, z * size);

  }

  function addY(x, z, arr, startindex){
    for(var y = -2; y <= 2; y++ )
      if(arr[startindex + y + 2] % 2 == 0)
      	addCube(x, y, z);
  }

  function toArr(hash){
    var retArr = new Array();
    for(var x = 0; x < hash.length; x+=2){
      retArr.push(parseInt(hash.substring(x, x+2), 16) % 2);
    }
    return retArr;
  }


  function plot(){
  	var str = $('#it').val();
    cmat = getMat(hash(str));
    group.children = [];
    var arr = toArr(hash(str));
    var count = 1;

    var startDict = {};
    for(var x = -2; x <= 2; x++)
      for(var z = -2; z <= 2; z++){
        if(startDict[x * x + z * z])
        {
          var c = startDict[x * x + z * z];
          addY(x, z, arr, 5 * c);
          if(z!=x)
          addY(z, x, arr, 5 * c);
          count++;
        }
        else
        {
          startDict[x * x + z * z] = count;
          addY(x, z, arr, 5 * count);
          if(z!=x)
          addY(z, x, arr, 5 * count);

          count++;

        }



      }    
    

  }      
  function hash(x){
    return CryptoJS.SHA512(x).toString();
  }


  function getMat(hash){
    return new THREE.MeshNormalMaterial( { color: pickColor(hash), overdraw:true } )
  }

  function pickColor(hash){
    var r = "8";
    var g = "8";
    var b = "8";
    var r1 = hash.substring(0, 1);
    var r2 = hash.substring(1, 2);
    var p1 = parseInt("0x" + r1, 16);
    var p2 = parseInt("0x" + r2, 16);
    if(p1 < 6)
      r = r1;
    else if(p1 < 12)
      g = r1;
    else
      b = r1;
    if(p2 < 6)
      r = r2;
    else if(p2 < 12)
      g = r2;
    else
      b = r2;  
    var col = "#"+r+g+b;
    var br = (16 - parseInt(r, 16)).toString(16);
    var bg = (16 - parseInt(g, 16)).toString(16);
    var bb = (16 - parseInt(b, 16)).toString(16);
    var bcol = "#"+br+bg+bb;

    return col;
  }

  function plotRandom(){
    var x = Math.random()
    $('#it').val(x)
    plot();
    return x;
  }
      function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );




        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
        camera.position.z = 1000;

        // controls = new THREE.TrackballControls( camera );       


        scene = new THREE.Scene();


        group = new THREE.Object3D();
        scene.add( group );

        var ambientLight = new THREE.AmbientLight(0x000044);
        scene.add(ambientLight);

        renderer = new THREE.CanvasRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );


        window.addEventListener( 'resize', onWindowResize, false );

      }

      function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

      }

      function animate() {

        requestAnimationFrame( animate );

        render();

      }

      function render() {
        if(autoControl){
        group.rotation.y+=0.01;
        group.rotation.z = Math.sin(group.rotation.y) * Math.PI / 4;         
        }
        
        camera.lookAt( scene.position );

        renderer.render( scene, camera );

        // controls.update();
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );

      }

      function isMobile(){
       return  navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i);
      }

      function onDocumentMouseMove( event ) {
        if(autoControl)
          return; 
        var omx = mouseX;
        var omy = mouseY;
        timeFrom = 0;
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
        if(omx == -1)
          return;
        group.rotation.y += (omx - mouseX) * 0.005;
        group.rotation.z += (omy - mouseY) * 0.01;

      }      
