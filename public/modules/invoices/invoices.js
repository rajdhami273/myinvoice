 angular.module('myapp').directive('invoicesModule',function($http,$rootScope,$window,$filter){
    return{
        restrict:'E',
        templateUrl:'modules/invoices/invoices.html',
        link:function(scope,elem){
            scope.fn={
                newInvoice:function(){
                    scope.var.invoice.customer_name='0';
                    var inv={
                        customer_id:parseInt(scope.var.invoice.customer_name),
                        discount:0,
                        total:parseFloat(scope.fn.getAllTotal())
                    }

                    $http.post('/api/invoices',inv).success(function(v){
                        
                        scope.var.invoice.id=v.id;
                        scope.var.invoice={
                            id:v.id,
                            customer_name:v.customer_id+'',
                            product:'-1',
                            products:[],
                            discount:v.discount
                        }
                    });
                    $('#new-invoice').modal('show');
                    scope.fn.getInvoices();
                },
                
                editInvoice:function(id){
                    
                    $http.get('/api/invoices/'+id).success(function(v){
                        
                        $http.get('/api/invoices/'+id+'/items').success(function(a){
                            var prods=[];
                            for(var i=0;i<a.length;i++){
                                var prod=scope.fn.getProductInfo(a[i].product_id);
                                prods.push({
                                    id:a[i].id,
                                    product_id:a[i].product_id,
                                    name:prod.name,
                                    price:prod.price,
                                    quantity:a[i].quantity
                                });
                            };
                            
                            scope.var.invoice={
                                id:v.id,
                                customer_name:v.customer_id+'',
                                product:'-1',
                                products:prods,
                                discount:v.discount
                            };
                            $('#new-invoice').modal('show');
                        });
                    });
                },
                getInvoices:function(){
                    $http.get('/api/invoices').success(function(v){
                        
                        for(var i=0;i<v.length;i++){
                            var customer=scope.fn.getCustomerInfo(v[i].customer_id);
                            if(!customer){
                                v[i].customer_name='Not Set';
                            }else{
                                v[i].customer_name=customer.name;
                            }
                        }
                        scope.var.invoices=v;
                    });
                },
                getCustomerInfo:function(id,a){
                    for(var i=0;i<scope.var.customers.length;i++){
                        if(scope.var.customers[i].id==id){
                            if(a==undefined){
                                return scope.var.customers[i];                               
                            }else{
                                return scope.var.customers[i][a];
                            }
                        }
                    }
                    return false;
                },
                getProductInfo:function(id,a){
                    for(var i=0;i<scope.var.products.length;i++){
                        if(scope.var.products[i].id==id){
                            if(a==undefined){
                                return scope.var.products[i];                               
                            }else{
                                return scope.var.products[i][a];
                            }
                        }
                    }
                    return false;
                },
                getEachTotal:function(product){
                    return parseFloat((parseFloat(product.quantity)*parseFloat(product.price)).toFixed(2));
                },

                getTotalPrice:function(){
                    var total=0.0;
                    for(var i=0;i<scope.var.invoice.products.length;i++){
                        total=total+scope.fn.getEachTotal(scope.var.invoice.products[i]);
                    }
                    return parseFloat((total).toFixed(2));
                },
                getTotalDiscount:function(){
                    return parseFloat((parseFloat(scope.fn.getTotalPrice())*parseFloat(scope.var.invoice.discount)/100).toFixed(2));
                },
                getAllTotal:function(){
                    return parseFloat((scope.fn.getTotalPrice()-scope.fn.getTotalDiscount()).toFixed(2));
                },
                addProductToList:function(){
                    if(scope.var.invoice.product=='-1'){
                        return false;
                    }
                    var ind=parseInt(scope.var.invoice.product);
                    for(var i=0;i<scope.var.invoice.products.length;i++){
                        if(scope.var.invoice.products[i].product_id==scope.var.products[ind].id){
                            return false;
                        }
                    }
                    var par={
                        product_id:scope.var.products[ind].id,
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
                        scope.fn.updateCustomers();
                    });
                    
                },
                deleteInvoice:function(id){
                    
                    $http.delete('/api/invoices/'+id).success(function(){
                        scope.fn.getInvoices();
                    });
                },
                deleteItem:function(index){
                    $http.delete('/api/invoices/'+scope.var.invoice.id+'/items/'+scope.var.products[index].id).success(function(v){
                        scope.var.invoice.products.splice(index,1);
                        scope.fn.updateCustomers();
                    });
                },
                updateCustomers:function(){
                    var cust={
                        customer_id:parseInt(scope.var.invoice.customer_name),
                        discount:parseFloat(scope.var.invoice.discount),
                        total:parseFloat(scope.fn.getAllTotal())
                    }
                    console.log(cust);
                    $http.put('/api/invoices/'+scope.var.invoice.id,cust).success(function(v){
                        console.log(v);
                        scope.fn.getInvoices();
                    });
                },
                updateQuantity:function(product){
                    var qty={
                        product_id:product.id,
                        quantity:product.quantity
                    }
                    $http.put('/api/invoices/'+scope.var.invoice.id+'/items/'+product.id,qty).success(function(v){
                        scope.fn.updateCustomers();
                    });
                },
                getCustomers:function(callback){
                    $http.get('/api/customers').success(function(v){
                        scope.var.customers=v;
                        callback();
                    });
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
                            discount:'0'
                        },
                        products:[
                            {
                                id:1,
                                name:'Bags',
                                price:200
                            },
                            {
                                id:1,
                                name:'Books',
                                price:150
                            }
                        ],
                        customers:[
                            {
                                id:1,
                                name:'Nidhil',
                                address:'Matru Sneha',
                                phone:'9920441345'
                            },
                            {
                                id:1,
                                name:'Raj',
                                address:'Happy Home',
                                phone:'9920441435'
                            }
                        ]
                    },
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