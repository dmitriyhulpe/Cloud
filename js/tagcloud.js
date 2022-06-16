(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.TagCloud = factory());
  } (this, (function () { 'use strict';
  
    function classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
  
    function defineProperties(target, props) {
      for (let i = 0; i < props.length; i++) {
        let descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
  
    function createClass(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    }
  
    function defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
  
      return obj;
    }
  
    function Extends() {
      Extends = Object.assign || function (target) {
        for (let i = 1; i < arguments.length; i++) {
          let source = arguments[i];
  
          for (let key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
  
        return target;
      };
  
      return Extends.apply(this, arguments);
    }
  
    function ownKeys(object, enumerableOnly) {
      let keys = Object.keys(object);
  
      if (Object.getOwnPropertySymbols) {
        let symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
      }
  
      return keys;
    }
  
    function objectSpread(target) {
      for (let i = 1; i < arguments.length; i++) {
        let source = arguments[i] != null ? arguments[i] : {};
  
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
  
      return target;
    }

    let TagCloud = function () {
      function TagCloud() {
        let container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
        let texts = arguments.length > 1 ? arguments[1] : undefined;
        let options = arguments.length > 2 ? arguments[2] : undefined;
  
        classCallCheck(this, TagCloud);
  
        let self = this;
        if (!container || container.nodeType !== 1) return new Error('Incorrect element type');
  
        self.$container = container;
        self.texts = texts || [];
        self.config = objectSpread(objectSpread({}, TagCloud.defaultConfig), options || {});
  
        self.radius = self.config.radius;
  
        self.depth = 2 * self.radius;
  
        self.size = 1.5 * self.radius;
  
        self.maxSpeed = TagCloud.getMaxSpeed(self.config.maxSpeed);
  
        self.initSpeed = TagCloud.getInitSpeed(self.config.initSpeed);
  
        self.direction = self.config.direction;
  
        self.keep = self.config.keep;
  
        self.paused = false;
    
        self.createElment();
  
  
        self.init();
  
  
        TagCloud.list.push({
          el: self.$el,
          container: container,
          instance: self
        });
      }
  
      createClass(TagCloud, [{
        key: "createElment",
  
        value: function createElment() {
          let self = this;
  
          let $el = document.createElement('div');
          $el.className = self.config.containerClass;
  
          if (self.config.useContainerInlineStyles) {
            $el.style.position = 'relative';
            $el.style.width = "".concat(2 * self.radius, "px");
            $el.style.height = "".concat(2 * self.radius, "px");
          }
  
          self.items = [];
          self.texts.forEach(function (text, index) {
            let item = self.createTextItem(text, index);
  
            $el.appendChild(item.el);
            self.items.push(item);
          });
          self.$container.appendChild($el);
          self.$el = $el;
        }
  
      }, {
        key: "createTextItem",
        value: function createTextItem(text) {
          let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          let self = this;
          let itemEl = document.createElement('span');
          itemEl.className = self.config.itemClass;
  
          if (self.config.useItemInlineStyles) {
            itemEl.style.willChange = 'transform, opacity, filter';
            itemEl.style.position = 'absolute';
            itemEl.style.top = '50%';
            itemEl.style.left = '50%';
            itemEl.style.zIndex = index + 1;
            itemEl.style.filter = 'alpha(opacity=0)';
            itemEl.style.opacity = 0;
            let transformOrigin = '50% 50%';
            itemEl.style.WebkitTransformOrigin = transformOrigin;
            itemEl.style.MozTransformOrigin = transformOrigin;
            itemEl.style.OTransformOrigin = transformOrigin;
            itemEl.style.transformOrigin = transformOrigin;
            let transform = 'translate3d(-50%, -50%, 0) scale(1)';
            itemEl.style.WebkitTransform = transform;
            itemEl.style.MozTransform = transform;
            itemEl.style.OTransform = transform;
            itemEl.style.transform = transform;
          }
  
          itemEl.innerText = text;
          return objectSpread({
            el: itemEl
          }, self.computePosition(index));
        }
  
      }, {
        key: "computePosition",
        value: function computePosition(index) {
          let random = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          let self = this;
          let textsLength = self.texts.length;
  
          if (random) index = Math.floor(Math.random() * (textsLength + 1));
          let phi = Math.acos(-1 + (2 * index + 1) / textsLength);
          let theta = Math.sqrt((textsLength + 1) * Math.PI) * phi;
          return {
            x: self.size * Math.cos(theta) * Math.sin(phi) / 2,
            y: self.size * Math.sin(theta) * Math.sin(phi) / 2,
            z: self.size * Math.cos(phi) / 2
          };
        }
      }, {
        key: "requestInterval",
        value: function requestInterval(fn, delay) {
          let requestAnimFrame = (function () {
            return window.requestAnimationFrame;
          } || function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
          })();
  
          let start = new Date().getTime();
          let handle = {};
  
          function loop() {
            handle.value = requestAnimFrame(loop);
            let current = new Date().getTime(),
                delta = current - start;
  
            if (delta >= delay) {
              fn.call();
              start = new Date().getTime();
            }
          }
  
          handle.value = requestAnimFrame(loop);
          return handle;
        }
  
      }, {
        key: "init",
        value: function init() {
          let self = this;
          self.active = false;
  
          self.mouseX0 = self.initSpeed * Math.sin(self.direction * (Math.PI / 180));
  
          self.mouseY0 = -self.initSpeed * Math.cos(self.direction * (Math.PI / 180));
  
          self.mouseX = self.mouseX0;
  
          self.mouseY = self.mouseY0;
  
          TagCloud.on(self.$el, 'mouseover', function () {
            self.active = true;
          });
  
  
          TagCloud.on(self.$el, 'mouseout', function () {
            self.active = false;
          });
  
  
          TagCloud.on(self.keep ? window : self.$el, 'mousemove', function (ev) {
            ev = ev || window.event;
            let rect = self.$el.getBoundingClientRect();
            self.mouseX = (ev.clientX - (rect.left + rect.width / 2)) / 5;
            self.mouseY = (ev.clientY - (rect.top + rect.height / 2)) / 5;
          });
  
          self.next();
  
          self.interval = self.requestInterval(function () {
            self.next.call(self);
          }, 10);
        }
  
      }, {
        key: "next",
        value: function next() {
          let self = this;
  
          if (self.paused) {
            return;
          }
  
  
          if (!self.keep && !self.active) {
            self.mouseX = Math.abs(self.mouseX - self.mouseX0) < 1 ? self.mouseX0 : (self.mouseX + self.mouseX0) / 2;
  
            self.mouseY = Math.abs(self.mouseY - self.mouseY0) < 1 ? self.mouseY0 : (self.mouseY + self.mouseY0) / 2;
          }
  
          let a = -(Math.min(Math.max(-self.mouseY, -self.size), self.size) / self.radius) * self.maxSpeed;
          let b = Math.min(Math.max(-self.mouseX, -self.size), self.size) / self.radius * self.maxSpeed;
          if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) return;
  
          let l = Math.PI / 180;
          let sc = [Math.sin(a * l), Math.cos(a * l), Math.sin(b * l), Math.cos(b * l)];
          self.items.forEach(function (item) {
            let rxz = item.x;
            let ryz = item.y * sc[1] + item.z * -sc[0];
            let rzx = item.y * sc[0] + item.z * sc[1];
            let rxy = rxz * sc[3] + rzx * sc[2];
            let ryx = ryz;
            let rzy = rzx * sc[3] - rxz * sc[2];
            let per = 2 * self.depth / (2 * self.depth + rzy);
  
            item.x = rxy;
            item.y = ryx;
            item.z = rzy;
            item.scale = per.toFixed(3);
            let alpha = per * per - 0.25;
            alpha = (alpha > 1 ? 1 : alpha).toFixed(3);
            let itemEl = item.el;
            let left = (item.x - itemEl.offsetWidth / 2).toFixed(2);
            let top = (item.y - itemEl.offsetHeight / 2).toFixed(2);
            let transform = "translate3d(".concat(left, "px, ").concat(top, "px, 0) scale(").concat(item.scale, ")");
            itemEl.style.WebkitTransform = transform;
            itemEl.style.MozTransform = transform;
            itemEl.style.OTransform = transform;
            itemEl.style.transform = transform;
            itemEl.style.filter = "alpha(opacity=".concat(100 * alpha, ")");
            itemEl.style.opacity = alpha;
          });
        }


      }, {
        key: "update",
        value: function update(texts) {
          let self = this;
  
          self.texts = texts || [];
  
          self.texts.forEach(function (text, index) {
            let item = self.items[index];
  
            if (!item) {
              item = self.createTextItem(text, index);
  
              Extends(item, self.computePosition(index, true));
  
  
              self.$el.appendChild(item.el);
              self.items.push(item);
            }
  
  
            item.el.innerText = text;
          });
  
          let textsLength = self.texts.length;
          let itemsLength = self.items.length;
  
          if (textsLength < itemsLength) {
            let removeList = self.items.splice(textsLength, itemsLength - textsLength);
            removeList.forEach(function (item) {
              self.$el.removeChild(item.el);
            });
          }
        }
  
      }, {
        key: "destroy",
        value: function destroy() {
          let self = this;
          self.interval = null;
  
          let index = TagCloud.list.findIndex(function (event) {
            return event.el === self.$el;
          });
          if (index !== -1) TagCloud.list.splice(index, 1);
  
          if (self.$container && self.$el) {
            self.$container.removeChild(self.$el);
          }
        }
      }, {
        key: "pause",
        value: function pause() {
          let self = this;
          self.paused = true;
        }
      }, {
        key: "resume",
        value: function resume() {
          let self = this;
          self.paused = false;
        }
      }], [{
        key: "on",
        value: function on(el, ev, handler, cap) {
          if (el.addEventListener) {
            el.addEventListener(ev, handler, cap);
          } else if (el.attachEvent) {
            el.attachEvent("on".concat(ev), handler);
          } else {
            el["on".concat(ev)] = handler;
          }
        }
      }]);
  
      return TagCloud;
    }();
  
    TagCloud.list = [];
    TagCloud.defaultConfig = {
      radius: 100,
      maxSpeed: 'normal',
      initSpeed: 'normal',
      direction: 135,
      keep: true,
      useContainerInlineStyles: true,
      useItemInlineStyles: true,
      containerClass: 'cloud',
      itemClass: 'tag'
    };
  
    TagCloud.getMaxSpeed = function (name) {
      return {
        slow: 0.5,
        normal: 1,
        fast: 2
      }[name] || 1;
    };
  
    TagCloud.getInitSpeed = function (name) {
      return {
        slow: 16,
        normal: 32,
        fast: 80
      }[name] || 32;
    };
  
    let index = (function (els, texts, options) {
      if (typeof els === 'string') els = document.querySelectorAll(els);
      if (!els.forEach) els = [els];
      let instances = [];
      els.forEach(function (el) {
        if (el) {
          instances.push(new TagCloud(el, texts, options));
        }
      });
      return instances.length <= 1 ? instances[0] : instances;
    });
  
    return index;
  
  })));