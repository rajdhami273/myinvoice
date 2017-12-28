angular.module('myapp').directive('customersModule',function($rootScope,$http,$window,$filter){
    return{
        restrict:'E',
        templateUrl:'/modules/customers/customers.html',
        link:function(scope,elem){
            scope.fn={
                newCustomer:function(){
                    scope.var.newcust.customer_name='';
                    scope.var.newcust.customer_address='';
                    scope.var.newcust.customer_phone='';
                    $('#new-customer').modal('show');
                },
                addCustomer:function(){
                    var customer={
                        name:scope.var.newcust.customer_name,
                        address:scope.var.newcust.customer_address,
                        phone:scope.var.newcust.customer_phone
                    }
                    var name=angular.lowercase(customer.name);
                    console.log(name);
                    $http.get('/api/customers').success(function(c){
                        for(var i=0;i<c.length;i++){
                            var names=angular.lowercase(c[i].name);
                            if(name==names){
                                $window.alert('Customer Already Exists.')
                                return false;
                            }
                        }
                        $http.post('/api/customers',customer).success(function(v){
                            console.log(v);
                            scope.fn.getCustomers();
                        });
                    });
                    $('#new-customer').modal('hide');
                },
                editCustomer:function(id){
                    scope.var.cid=id;
                    $http.get('/api/customers/'+id).success(function(v){
                        scope.var.newcust.customer_name=v.name;
                        scope.var.newcust.customer_address=v.address;
                        scope.var.newcust.customer_phone=v.phone;
                        $('#edit-customer').modal('show');
                    })
                },
                updateCustomer:function(){
                    console.log(scope.var.cid);
                    var edit_customer={
                        name:scope.var.newcust.customer_name,
                        address:scope.var.newcust.customer_address,
                        phone:scope.var.newcust.customer_phone
                    }
                    var name=angular.lowercase(edit_customer.name);
                    console.log(edit_customer);
                    $http.get('/api/customers').success(function(c){
                        for(var i=0;i<c.length;i++){
                            var names=angular.lowercase(c[i].name);
                            if(name==names){
                                $window.alert('Customer Already Exists.')
                                return false;
                            }
                        }
                    $http.put('/api/customers/'+scope.var.cid,edit_customer).success(function(v){
                        console.log(v);
                        $('#edit-customer').modal('hide');
                        scope.fn.getCustomers();
                    });
                })
                },
                deleteCustomer:function(id){
                    $http.delete('/api/customers/'+id).success(function(v){
                        console.log(v);
                        scope.fn.getCustomers();
                    })
                },
                getCustomers:function(){
                    $http.get('/api/customers').success(function(v){
                        console.log(v);
                        scope.var.customers=v;
                    })
                },
                init:function(){
                    scope.var={
                        newcust:{
                            customer_name:'',
                            customer_address:'',
                            customer_phone:''
                        },
                        customers:[
                            {
                                id:1,
                                name:'Nidhil',
                                address:'Matru Sneha',
                                phone:'9920441345'
                            },
                            {
                                id:2,
                                name:'Raj',
                                address:'Happy Home',
                                phone:'9920441435'
                            }
                        ]
                    },
                    scope.fn.getCustomers();
                }
            };
            scope.fn.init();
        }
    }
})