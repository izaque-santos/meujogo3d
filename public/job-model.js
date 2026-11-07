/* Personagem de emprego: modelo Mixamo com esqueleto e animação FBX. */
var JOB_MODEL = (function () {
  var G = null, loader = null, cache = null, loading = null;
  function load() {
    if (cache || loading || !window.FBXLoader || !G) return loading;
    loader = loader || new THREE.FBXLoader();
    loading = new Promise(function (resolve, reject) {
      loader.load('/JogInCircle.fbx', function (root) {
        var box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3());
        var height = Math.max(size.y, .001), scale = 1.86 / height;
        root.scale.setScalar(scale);
        box.setFromObject(root);
        root.position.y -= box.min.y;
        root.traverse(function (o) {
          if (o.isMesh) {
            o.castShadow = true; o.receiveShadow = true;
            var mats = Array.isArray(o.material) ? o.material : [o.material];
            mats.forEach(function (mat) {
              if (!mat) return;
              /* O FBX enviado aponta para a pasta .fbm do computador de origem.
                 Se a textura não estiver disponível, mantém a cor do material em vez de deixar o boneco preto. */
              if (mat.map && mat.map.image) mat.map.encoding = THREE.sRGBEncoding;
              if (!mat.map && mat.color && mat.color.getHex() === 0) mat.color.set(0xb8a58d);
              mat.needsUpdate = true;
            });
          }
        });
        var mixer = new THREE.AnimationMixer(root);
        if (root.animations && root.animations.length) {
          var action = mixer.clipAction(root.animations[0]);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
        }
        root.visible = false;
        root.userData.mixer = mixer;
        root.userData.baseScale = scale;
        G.scene.add(root);
        cache = root;
        resolve(root);
      }, undefined, reject);
    }).catch(function (e) {
      loading = null;
      if (window.console) console.error('Não foi possível carregar o personagem do emprego.', e);
      return null;
    });
    return loading;
  }
  function init(state) { G = state; load(); }
  function setActive(p, on) {
    if (!p) return;
    p.jobModelOn = !!on;
    if (!on) {
      if (cache) cache.visible = false;
      p.av.visible = true;
      return;
    }
    var pending = load();
    if (!pending) return;
    pending.then(function (root) {
      if (!root || !p.jobModelOn || !G || !G.me || p !== G.me) return;
      root.visible = true;
      p.av.visible = false;
      sync(p, 0);
    });
  }
  function sync(p, dt) {
    if (!cache || !p || !G || p !== G.me) return;
    if (p.jobModelOn) {
      cache.visible = true;
      cache.position.copy(p.av.position);
      cache.rotation.copy(p.av.rotation);
      if (cache.userData.mixer) cache.userData.mixer.update(dt || 0);
      p.av.visible = false;
    } else {
      cache.visible = false;
      p.av.visible = true;
    }
  }
  return { init: init, setActive: setActive, step: sync };
})();
