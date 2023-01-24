frappe.ui.form.on('Expense Claim',  {
    refresh: function(frm) {
        frm.set_query('employee', function() {
			return {
				'filters': {
					'name': ['=', '']
				}
			};
		});
    }
});
// frappe.ui.form.on('Expense Claim',  {
//     refresh: function(frm) {
//         //frappe.msgprint('child.indent_name')
//         // var site_url;
//         // var child = frm.doc.indent
//         // const emp_adv = []

//         // frappe.run_serially([ 
//         //     () =>   frm.call({
//         //                 //async:false = Code paused. (Other code waiting for this to finish.)
//         //                 //async:true = Code continued. (Nothing gets paused. Other code is not waiting.)
//         //                 async: false,
//         //                 //app path
//         //                 method: "precihole.public.py.purchase_order.get_site_url",
//         //                 callback: function(r) {
//         //                     if(r.message)
//         //                     site_url = r.message.data
                            
//         //                 }
//         //             }),
//         //     () => { 
//         //         for(var t=0;t<child.length;t++){

//         //         }
//         //         //frm.refresh_field('advances')
//         //     },
//         //     () => {
//         //         //var test = ['test','hhh']
//         //         //console.log(emp_adv)
//         //     }
//         // ],
//         // );
//     }
// });

// frappe.ui.form.on('Indent Details', {
// 	indent_name(frm, cdt, cdn) {
//         var child = locals[cdt][cdn];
//         var site_url;
//         var emp_adv = []
//         //frappe.msgprint(child.indent_name)
//         frm.call({
//             //async:false = Code paused. (Other code waiting for this to finish.)
//             //async:true = Code continued. (Nothing gets paused. Other code is not waiting.)
//             async: false,
//             //app path
//             method: "precihole.public.py.purchase_order.get_site_url",
//             callback: function(r) {
//                 if(r.message)
//                 site_url = r.message.data
                
//             }
//         })
//         //frappe.msgprint(site_url)
//         fetch(`${site_url}/api/resource/Employee%20Advance?filters=[["indent",%20"=",%20"${child.indent_name}"]]&fields=["name","posting_date","advance_amount","   "]`, {
//             method: 'GET',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//             }
//         })   
//         .then(r => r.json())s
//         .then(r => {
//             //console.log(r.data)
//             if(r.data !== undefined){
//                 for(var k=0;k<r.data.length;k++){
//                     if (frm.doc.advances == undefined){
//                         cur_frm.add_child("advances", {
//                             employee_advance : r.data[k].name,
//                             posting_date : r.data[k].posting_date,
//                             advance_paid : r.data[k].advance_amount,
//                             unclaimed_amount : r.data[k].advance_amount - r.data[k].claimed_amount
//                         })
//                     }
//                     // else if(frm.doc.advances !== undefined){
//                     //     for(var adv=0;adv<frm.doc.advances.length;adv++){
//                     //         if(frm.doc.advances[adv].employee_advance !== r.data[k].name){
//                     //             cur_frm.add_child("advances", {
//                     //                 employee_advance : r.data[k].name,
//                     //                 posting_date : r.data[k].posting_date,
//                     //                 advance_paid : r.data[k].advance_amount,
//                     //                 unclaimed_amount : r.data[k].advance_amount - r.data[k].claimed_amount
//                     //             })
//                     //         }
//                     //     }
//                     // }
                    
//                 }
//                 frm.refresh_field('advances');
//             }
//         })
// 	}
// })