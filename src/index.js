import $ from "jquery";
import Model from "./components/Model";
import View from "./components/View";
import Controller from "./components/Controller";
import "@data/styles";
import "@data/images";
import "@js/main";

(function ($) {
  $.fn.rangeFSD = function (params) {
    for (let i = 0; i < this.length; i++){
      !params ? params = {target: this[i]} : params.target = this[i];
      this[i].model = new Model(params);
      this[i].view = new View(this[i].model);
      this[i].controller = new Controller(this[i].model, this[i].view);
      this[i].controller.fsdProtection(this[i].model);
    }
  };
})($);

