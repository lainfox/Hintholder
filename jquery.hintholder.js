/* ============================================================
 * Hintholder 0.9.1
 * Placeholder for legacy IE or all mordern browser
 * ============================================================
 * Copyright 2015 lainfox
 * Licensed under MIT
 * Released on: July 02, 2015
 * ============================================================ */
!function($){
  'use strict';

  var Hintholder = function(element, options) {
    this.options = $.extend({}, Hintholder.DEFAULTS, options)
    this.$element = $(element)
    this.label_text  = this.$element.attr('placeholder')
    this.label_for   = this.$element.attr('id')

    this.$element
      .on('focusin.hint.placeholder', $.proxy(this._inFocus, this))
      .on('focusout.hint.placeholder', $.proxy(this._outFocus, this))
      .on('keydown.hint.placeholder', $.proxy(this._keyPress, this))
      .on('paste.hint.placeholder', $.proxy(this._keyPress, this))

    this.setLabel()
  }

  Hintholder.DEFAULTS = {
    compatible: false // false = only IE, true = all mordern browser
    ,opacity: true // true = lower opacity at focus, false = hide at focus
    ,color: null // placeholder color hex value #d1d1d1
    ,icon: null // icon class name in CSS declaration :: not yet implemented
  }
  Hintholder.RESET = 'hint-focus hint-hide'

  Hintholder.prototype._inFocus = function() {
    if( this.options.opacity ) {
      this.$label.addClass('hint-focus')
    }
    else {
      this.$label.addClass('hint-hide')
    }
  }
  Hintholder.prototype._outFocus = function() {
    if( !this.$element.val() )
      this.$label.removeClass( Hintholder.RESET)
  }
  Hintholder.prototype._keyPress = function() {
    this.$label.addClass('hint-hide')
  }
  Hintholder.prototype.setLabel = function() {
    var $el = this.$element

    this.$label =
      $('<label />')
        .attr('for', this.label_for)
        .addClass('hint-holder')
        .text( this.label_text )
        .css({
          'font-size': $el.css('font-size'),
          'line-height': $el.css('height'),
          'margin-left': $el.css('margin-left'),
          'margin-top': $el.css('margin-top'),
          'padding-left': $el.css('padding-left'),
          'height': $el.css('height')
        })
        .on('click.hint.placeholder', function(){ $el.focus() } )

    if( this.options.color ) {
      this.$label.css('color', this.options.color);
    }

    // Attach label
    if( !_placeholderIsSupported() ) { // only IE
      $el.before( this.$label )
    }
    else if( this.options.compatible === true ) { // All
      $el.addClass('hint-holder-input')
      $el.before( this.$label )
    }

    // hide hintholder when init value is not empty
    if( $el.val() ) {
      this.$label.addClass('hint-hide')
    }
  }

  function _placeholderIsSupported() {
    var test = document.createElement('input');
    return ('placeholder' in test);
  }

  function Init(option) {
    return this.each(function(){
      var $this       = $(this)
      ,   data        = $(this).data('hint.placeholder')
      ,   options     = typeof option == 'object' && option

      // console.log( data )
      if( !data ) $this.data('hint.placeholder', (data = new Hintholder(this, options) ))
    })
  }

  var old = $.fn.hintholder
  $.fn.hintholder             = Init
  $.fn.hintholder.Constructor = Hintholder
  $.fn.hintholder.noConflict = function() {
    $.fn.hintholder = old
    return this
  }

  $(window).on('load', function() {
    $('input[placeholder]').each(function() {
      var $hintholder = $(this)
      var data = $hintholder.data()

      Init.call( $hintholder, data )
    })
  })

}(jQuery)
