angular.module('myapp').directive('invoicesModule',function($http,$rootScope){
    return{
        restrict:'E',
        templateUrl:'modules/invoices/invoices.html',
        link:function(scope,elem){
            scope.fn={
                newInvoice:function(){
                    scope.var.invoice.customer_name='0';
                    var cust={
                        customer_id:parseInt(scope.var.invoice.customer_name),
                        discount:parseFloat(scope.fn.getDiscount()),
                        total:parseFloat(scope.fn.getTotalCost())
                    }
                    $http.post('/api/invoices',cust).success(function(v){
                        scope.var.invoice.id=v.id;
                        scope.var.invoice={
                            id:v.id,
                            customer_name:v.customer_id+'',
                            product:'-1',
                            products:[],
                            discount:v.discount
                        }
                        scope.fn.getInvoices();
                    });
                },
                getDiscount:function(){

                },

                getTotalCost:function(){

                },

                addProductToList:function(){
                    if(scope.var.invoice.product=='-1'){
                        return false;
                    }
                    var tid=parseInt(scope.var.invoice.product);
                    var par={
                        product_id:scope.var.products[tid].id,
                        quantity:1
                    }
                    $http.post('/api/invoices/'+scope.var.invoice.id+'/items',par).success(function(v){
                        var prod=scope.fn.getProductInfo(v.product_id);
                        var p={
                            id:v.id,
                            product_id:v.product_id,
                            name:prod.name,
                            price:prod.price,
                            quantity:'1'
                        }
                        scope.var.invoice.products.push(p);
                        scope.fn.updateCustomer();
                    });
                },

                getProductInfo:function(id){
                    for(var i=0;i<scope.var.products.length;i++){
                        if(scope.var.products[i].id==id){
                            
                                return scope.var.products[i];
                            
                        }
                        else{return false;}
                    }
                },

                updateCustomer:function(){
                    var par={
                        customer_id:parseInt(scope.var.invoice.customer_name),
                        discount:parseFloat(scope.fn.getDiscount()),
                        total:parseFloat(scope.fn.getTotalCost())
                    }
                    $http.put('/api/invoices/'+scope.var.invoice.id,par).success(function(){
                        scope.fn.getInvoices();
                    });
                },

                getCustomers:function(callback){
                    $http.get('/api/customers').success(function(v){
                        scope.var.customers=v;
                        callback();
                    });
                },

                getInvoices:function(){
                    $http.get('/api/invoices').success(function(v){
                        for(var i=0 ; i<v.length ; i++){
                            var customer=scope.fn.getCustomerInfo(v[i].customer_id);
                            if(!customer){
                                v[i].customer_name="not set";
                            }
                            else{
                                v[i].customer_name=customer.name;
                            }
                        }
                        scope.var.invoices=v;
                    });
                },

                getCustomerInfo:function(id){
                    for(var i=0 ; i<scope.var.customers.length ; i++){
                        if(scope.var.customers[i].id==id){
                            return scope.var.customers[i];
                        }
                    }
                    return false;
                },

                getProducts:function(){
                    $http.get('/api/products').success(function(v){
                        scope.var.products=v;
                    });
                },

                init:function(){
                    scope.var={
                        invoice:{
                            id:0,
                            customer_name:'0',
                            product:'-1',
                            products:[],
                            discount:0
                        },
                        products:[
                            {
                                id:1,
                                name:'Bag',
                                price:300
                            },
                            {
                                id:2,
                                name:'Dress',
                                price:600
                            }
                        ],
                        customers:[
                            {
                                id:1,
                                name:'RAJ',
                                address:'Happy Home',
                                phone:'9920441435'
                            },
                            {
                                id:2,
                                name:'Nidhil',
                                address:'Matru Bhakti',
                                phone:'9920441453'
                            }
                        ]
                    };
                    scope.fn.getCustomers(function(){
                        scope.fn.getInvoices();
                    });
                    scope.fn.getProducts();
                }
            }
            scope.fn.init();
        }
    }
});