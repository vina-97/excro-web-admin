$(document).ready(function(){
  $(" span i").toggleClass("transform_arrow");
  $(".side_nav_drop_down").fadeIn(500);
    $(".side_top_wrap").click(function(){
      $(".profile_drop_down").fadeToggle(0);
      $(".side_top_wrap_toggle").toggleClass("transform_arrow")
    });
    $(".side_nav_list li").click(function(){
      $(this).find(" span i").toggleClass("transform_arrow");
      $(this).children(".side_nav_drop_down").fadeToggle(500);
    });
    $(".hide_More_form").click(function(){
      $(".hide_More_form_data").removeClass("hide");
      $(".hide_More_form").addClass("hide");
      $(".hide_More_remove").removeClass("hide");
    });
    $(".hide_More_remove").click(function(){
      $(".hide_More_form_data").addClass("hide");
      $(".hide_More_form").removeClass("hide");
      $(".hide_More_remove").addClass("hide");
    });
  });

  