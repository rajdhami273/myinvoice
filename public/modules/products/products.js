angular.module('myapp').directive('productsModule',function($rootScope,$http,$window,$filter){
    return{
        restrict:'E',
        templateUrl:'/modules/products/products.html',
        link:function(scope,elem){
            scope.fn={
                newProduct:function(){
                    scope.var.newprod.product_name='';
                    scope.var.newprod.product_price='';
                    $('#new-product').modal('show');
                },
                addProduct:function(){ 
                    var product={
                        name:scope.var.newprod.product_name,
                        price:scope.var.newprod.product_price
                    }
                    var prod=angular.lowercase(product.name); 
                    $http.get('/api/products').success(function(c){
                        for(var i=0;i<c.length;i++){
                            var products=angular.lowercase(c[i].name);
                            if(prod==products){
                                $window.alert('Product Already Exists.')
                                return false;
                            }
                        } 
                        $http.post('/api/products',product).success(function(v){
                            console.log(v);
                            scope.fn.getProducts();
                        });  
                    });
                    $('#new-product').modal('hide');   
                },
                editProduct:function(id){
                    scope.var.pid=id;
                    $http.get('/api/products/'+id).success(function(v){
                        console.log(v);
                        scope.var.newprod.product_name=v.name;
                        scope.var.newprod.product_price=v.price;
                        $('#edit-product').modal('show');  
                    })
                },
                updateProduct:function(){
                    console.log(scope.var.pid);
                    var edit_product={
                        name:scope.var.newprod.product_name,
                        price:scope.var.newprod.product_price
                    }
                    console.log(edit_product);
                    var prod=angular.lowercase(edit_product.name); 
                    $http.get('/api/products').success(function(c){
                        for(var i=0;i<c.length;i++){
                            var products=angular.lowercase(c[i].name);
                            if(prod==products){
                                $window.alert('Product Already Exists.')
                                return false;
                            }
                        } 
                    
                    $http.put('/api/products/'+scope.var.pid,edit_product).success(function(v){
                        console.log(v);
                        $('#edit-product').modal('hide');
                        scope.fn.getProducts();
                    });
                });
                },
                deleteProduct:function(id){
                    console.log(id);
                    $http.delete('/api/products/'+id).success(function(v){
                        console.log(v);
                        scope.fn.getProducts();
                    });
                },
                getProducts:function(){
                    $http.get('/api/products').success(function(v){
                        scope.var.products=v;
                    });
                },
                init:function(){
                    scope.var={
                        newprod:{
                                product_name:'',
                                product_price:''
                            },
                        products:[
                            {
                                id:1,
                                name:'Bags',
                                price:200
                            }
                        ]
                    },
                    scope.fn.getProducts();
                }
            };
            scope.fn.init();
        }
    }
})