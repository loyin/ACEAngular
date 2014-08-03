angular.module('dashboard', ['ngSanitize'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl:'dashboard/dashboard.tpl.html',
    controller:'DashboardViewCtrl'
  });
}])
.directive('ageLine', function () {
    return {
        restrict: 'A',
        scope: { agedata: '=' },
        link: function (scope, elem) {
            console.log(scope);
            scope.$watch('agedata', function (newval) {
                var $box = elem.closest('.infobox');
                var barColor = !$box.hasClass('infobox-dark') ? $box.css('color') : '#FFF';
                var chartRangeMin=elem.data('min') || 0;
                //('html', {tagValuesAttribute:'data-values', type: 'bar', barColor: barColor , chartRangeMin:$(this).data('min') || 0} );
                //myvalues, { type:'bar', barColor:'green' }
                elem.sparkline(scope.agedata,{type:'bar', barColor:barColor,chartRangeMin:chartRangeMin});
            });
        }
    };
}).
directive('easyPieChart',function(){
  return{
    restrict:'A',
    scope:{
      percent:'=',
      size:'='
    },
    link:function(scope,elem){
      scope.$watch('size',function (newval){
        var $box = elem.closest('.infobox');
        var barColor = elem.data('color') || (!$box.hasClass('infobox-dark') ? $box.css('color') : 'rgba(255,255,255,0.95)');
        var trackColor = barColor == 'rgba(255,255,255,0.95)' ? 'rgba(255,255,255,0.25)' : '#E2E2E2';
        var size = parseInt(scope.size) || 50;
        console.log(barColor);
        console.log(trackColor);

        elem.easyPieChart({
          barColor: barColor,
          trackColor: trackColor,
          scaleColor: false,
          lineCap: 'butt',
          lineWidth: parseInt(size/10),
          animate: /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase()) ? false : 1000,
          size: size
        });
      });
    }
  };
}).
directive('easyFlot',function(){
  return{
    restrict:'A',
    scope:{
      flotdata:'='
    },
    link:function(scope,elem){
      scope.$watch('flotdata',function (newval){
        var placeholder = elem.css({'width':'90%' , 'min-height':'150px'});
        $.plot(placeholder, scope.flotdata, {
          series: {
            pie: {
              show: true,
              tilt:0.8,
              highlight: {
                opacity: 0.25
              },
              stroke: {
                color: '#fff',
                width: 2
              },
              startAngle: 2
            }
          },
          legend: {
            show: true,
            position: "ne",
            labelBoxBorderColor: null,
            margin:[-30,15]
          }
          ,
          grid: {
            hoverable: true,
            clickable: true
          }
         });
      });

    }

  };
})
.controller('DashboardViewCtrl', ['$scope','$location','$routeParams', function ($scope, $location, $routeParams) {
  $scope.alerts=[
    { type: 'success', msg: 'Welcome to  Ace (v1.2), the lightweight, feature-rich and easy to use admin template.',icon:'icon-ok green'}
  ];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.sparkline={
    value:[196,128,202,177,154,94,100,170,224]
  };
  $scope.earnings={
    value:[3,4,2,3,4,4,2,2]
  }


  $scope.flotdata = [
  { label: "social networks",  data: 38.7, color: "#68BC31"},
  { label: "search engines",  data: 24.5, color: "#2091CF"},
  { label: "ad campaigns",  data: 8.2, color: "#AF4E96"},
  { label: "direct traffic",  data: 18.6, color: "#DA5430"},
  { label: "other",  data: 10, color: "#FEE074"}
  ]
  //{tagValuesAttribute:'data-values', type: 'bar', barColor: barColor , chartRangeMin:$(this).data('min') || 0}
   
}]);


