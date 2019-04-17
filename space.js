var camera, scene, renderer;
var mouseX = 0;
var mouseY = 0;

var bgPlanets = [];

setup();
update();
draw();

function setup()
{
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1E1E1E);
  camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,.1,10000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(innerWidth,innerHeight);
  document.body.appendChild(renderer.domElement);

  createStars();
  createBackgroundPlanets(200,1500);

  ambientLight = new THREE.AmbientLight(0x111111);
  scene.add(ambientLight);

  hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.33);
  scene.add(hemisphereLight);

  camera.position.z = 500;

  document.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('resize', onWindowResize,false);
}

//only runs one frame?
function update()
{

}

function draw()
{
  requestAnimationFrame(draw);

  updateCameraPosition();
  animateBackgroundPlanets();

  renderer.render(scene, camera);
}

function createBackgroundPlanets(amount, maxRange)
{
  for (var i = 0; i < amount; i++)
  {
    // create mesh
    geometry = new THREE.IcosahedronBufferGeometry(150,0);
    material = new THREE.MeshNormalMaterial({flatShading: true});
    mesh = new THREE.Mesh(geometry,material);

    // set random location
    var offset = maxRange/2;
    mesh.position.x = Math.random() * maxRange - offset;
    mesh.position.y = Math.random() * maxRange - offset;
    mesh.position.z = Math.random() * maxRange - offset;

    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
    mesh.rotation.z = Math.random() * 2 * Math.PI;

    mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.1;

    scene.add(mesh);
    bgPlanets.push(mesh);

  }
}

function createStars()
{
  starGeometry = new THREE.Geometry();

  for (i = 0; i < 5000; i++) {
    var vertex = new THREE.Vector3();
    var maxRange = 3000;
    var offset = maxRange / 2;
    vertex.x = maxRange * Math.random() - offset;
    vertex.y = maxRange * Math.random() - offset;
    // vertex.z = 1000 * Math.random() - 500;
    starGeometry.vertices.push(vertex);
  }

  starMaterial = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: false,
    transparent: true
  });
  starMaterial.color.setHex(0xff00ff);

  stars = new THREE.Points(starGeometry, starMaterial);
  stars.sortParticles = true;
  stars.position.z = -1000;
  scene.add(stars);
}

function animateBackgroundPlanets()
{
  var spd = 3;

  for (var i = 0; i < bgPlanets.length; i++)
  {
    var planet = bgPlanets[i];
    planet.position.z += spd;

    if(planet.position.z > 500)
    {
      planet.position.z -= 1500;
      planet.scale.x = planet.scale.y = planet.scale.z = .01;
    }

    increaseScaleOnRepeat(planet,.001)


  }

}

function updateCameraPosition()
{

  var maxY = 50
  var minY = -maxY;
  var maxX = ((((maxY*2)*window.innerWidth)/window.innerHeight))/2; // keep aspect ratio
  var minX = -maxX;

  var mx = Math.max( minX, Math.min( maxX, mouseX ) );
  var my = Math.max( minY, Math.min( maxY, mouseY ) );

  camera.position.x += ( mx - camera.position.x) * 0.02;
  camera.position.y += ( - my - camera.position.y) * 0.02;
}

function increaseScaleOnRepeat(planet, amount)
{
  if(planet.scale.x < .1)
  {
    planet.scale.set(planet.scale.x+amount,planet.scale.y+amount,planet.scale.z+amount);
  }
  else if (planet.scale.x > .1) {
    planet.scale.set(.1,.1,.1);
  }
}

function onMouseMove(event)
{
  mouseX = ( event.clientX - window.innerWidth/2);
  mouseY = ( event.clientY - window.innerHeight/2);
}

function onWindowResize()
{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
