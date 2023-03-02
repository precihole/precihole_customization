import frappe

def update_indent_progress_after_submit(doc, method):
    if doc.indent:
        for ind in doc.indent:
            # [PURCHASE ORDER]
            if doc.doctype == 'Purchase Order':
                if ind.is_partial == 'Yes':
                    purchase_order = frappe.db.get_all('Indent Details',{
                            'indent_name': ind.indent_name,
                            'docstatus': 1,
                            'parenttype': "Purchase Order"
                        },
                        ['parent','is_partial']
                    )
                    flag = 0
                    if purchase_order:
                        status = ['To Receive and Bill','To Bill','To Receive','Completed']
                        for po in purchase_order:
                            if frappe.db.get_value('Purchase Order', po.parent, 'status') in status:
                                if po.is_partial == 'No':
                                    flag = 1
                                    frappe.db.set_value('Indent',ind.indent_name,'order_status','Fully Ordered')
                                    workflow_state = frappe.db.get_value('Indent',ind.indent_name,'workflow_state')
                                    if not workflow_state == 'To Receive and Bill':
                                        frappe.db.set_value('Indent',ind.indent_name,'workflow_state','To Receive and Bill')
                    if flag == 0:
                        frappe.db.set_value('Indent',ind.indent_name,'order_status','Partially Ordered')
                        frappe.db.set_value('Indent',ind.indent_name,'workflow_state','To Receive and Bill')
                elif ind.is_partial == 'No':
                    frappe.db.set_value('Indent',ind.indent_name,'order_status','Fully Ordered')
                    workflow_state = frappe.db.get_value('Indent',ind.indent_name,'workflow_state')
                    if not workflow_state == 'To Receive and Bill':
                        frappe.db.set_value('Indent',ind.indent_name,'workflow_state','To Receive and Bill')

            # [PURCHASE RECEIPT]
            elif doc.doctype == 'Purchase Receipt':
                if ind.is_partial == 'Yes':

                    purchase_order = frappe.db.get_all('Indent Details',{
                            'indent_name': ind.indent_name,
                            'docstatus': 1,
                            'parenttype': "Purchase Order"
                        },
                        ['parent']
                    )
                    to_receive_count = 0
                    to_bill_count = 0
                    paid_count = 0
                    for po in purchase_order:
                        status = frappe.db.get_value('Purchase Order',po.parent,'status')
                        if status == 'To Receive and Bill':
                            to_receive_count = to_receive_count + 1
                        elif status == 'To Bill':
                            to_bill_count = to_bill_count + 1
                    
                    if to_receive_count > 0 or to_bill_count > 0:
                        is_partial_No = frappe.db.get_all('Indent Details',{
                                'indent_name': ind.indent_name,
                                'docstatus': 1,
                                'parenttype': "Purchase Order",
                                'is_partial': 'No'
                            },
                            ['parent']
                        )
                        if not is_partial_No:
                            frappe.db.set_value('Indent',ind.indent_name,'receive_status','Partially Received')
                        elif is_partial_No:
                            frappe.db.set_value('Indent',ind.indent_name,'receive_status','Fully Received')
                            frappe.db.set_value('Indent',ind.indent_name,'workflow_state','To Bill')
                    elif to_receive_count == 0 or to_bill_count == 0:
                        frappe.db.set_value('Indent',ind.indent_name,'receive_status','Fully Received')
                        frappe.db.set_value('Indent',ind.indent_name,'workflow_state','To Bill')

                elif ind.is_partial == 'No':
                    purchase_order = frappe.db.get_all('Indent Details',{
                            'indent_name': ind.indent_name,
                            'docstatus': 1,
                            'parenttype': "Purchase Order"
                        },
                        ['parent']
                    )
                    to_receive_count = 0
                    to_bill_count = 0
                    paid_count = 0

                    for po in purchase_order:
                        status = frappe.db.get_value('Purchase Order',po.parent,'status')
                        if status == 'To Receive and Bill':
                            to_receive_count = to_receive_count + 1
                    if to_receive_count > 0:
                        frappe.db.set_value('Indent',ind.indent_name,'receive_status','Partially Received')
                    elif to_receive_count == 0:
                        frappe.db.set_value('Indent',ind.indent_name,'receive_status','Fully Received')
                        frappe.db.set_value('Indent',ind.indent_name,'workflow_state','To Bill')

            # [PURCHASE INVOICE]
            elif doc.doctype == 'Purchase Invoice':
                if ind.is_partial == 'Yes':
                    purchase_order = frappe.db.get_all('Indent Details',{
                            'indent_name': ind.indent_name,
                            'docstatus': 1,
                            'parenttype': "Purchase Order"
                        },
                        ['parent','is_partial']
                    )
                    to_receive_count= 0
                    to_bill_count = 0
                    complete_count = 0
                    is_partial = 0
                    for po in purchase_order:
                        status = frappe.db.get_value('Purchase Order',po.parent,'status')
                        
                        #chk status function
                        if status == 'To Bill':
                            to_bill_count = to_bill_count + 1
                        elif status == 'To Receive and Bill':
                            to_receive_count = to_receive_count + 1
                        elif status == 'Completed':
                            complete_count = complete_count + 1
                        if po.is_partial == 'No':
                            is_partial = 1
                    if is_partial == 1 and to_bill_count == 0 and to_receive_count == 0 and complete_count == 0:
                        frappe.db.set_value('Indent',ind.indent_name,'billing_status','Fully Billed')
                        frappe.db.set_value('Indent',ind.indent_name,'workflow_state','Completed')
                    elif to_receive_count > 0 or to_bill_count > 0 or complete_count > 0:
                        is_partial_No = frappe.db.get_all('Indent Details',{
                                'indent_name': ind.indent_name,
                                'docstatus': 1,
                                'parenttype': "Purchase Order",
                                'is_partial': 'No'
                            },
                            ['parent']
                        )
                        if not is_partial_No:
                            frappe.db.set_value('Indent',ind.indent_name,'billing_status','Partially Billed')
                        elif is_partial_No:
                            frappe.db.set_value('Indent',ind.indent_name,'billing_status','Fully Billed')
                            frappe.db.set_value('Indent',ind.indent_name,'workflow_state','Completed')
                
                elif ind.is_partial == 'No':
                    purchase_order = frappe.db.get_all('Indent Details',{
                            'indent_name': ind.indent_name,
                            'docstatus': 1,
                            'parenttype': "Purchase Order"
                        },
                        ['parent']
                    )
                    to_receive_count= 0
                    to_bill_count = 0
                    paid_count = 0
                    for po in purchase_order:
                        status = frappe.db.get_value('Purchase Order',po.parent,'status')
                        
                        #chk status function
                        if status == 'To Bill':
                            to_bill_count = to_bill_count + 1
                        elif status == 'To Receive and Bill':
                            to_receive_count = to_receive_count + 1
                    
                    if to_bill_count == 0 and to_receive_count == 0:
                        frappe.db.set_value('Indent',ind.indent_name,'billing_status','Fully Billed')
                        frappe.db.set_value('Indent',ind.indent_name,'workflow_state','Completed')
                    elif to_receive_count > 0 or to_bill_count > 0:
                        frappe.db.set_value('Indent',ind.indent_name,'billing_status','Partially Billed')
                    #frappe.db.set_value('Indent',ind.indent_name,'billing_status','Fully Billed')
                    #frappe.db.set_value('Indent',ind.indent_name,'workflow_state','Completed')
              

def update_indent_progress_after_cancel(doc, method):
    if doc.indent:
        for ind in doc.indent:
            if doc.doctype == 'Purchase Order':
                purchase_order = frappe.db.get_all('Indent Details',{
                        'indent_name': ind.indent_name,
                        'docstatus': 1,
                        'parenttype': "Purchase Order"
                    },
                    ['parent']
                )
                to_receive_count= 0
                to_bill_count = 0
                paid_count = 0
                for po in purchase_order:
                    status = frappe.db.get_value('Purchase Order',po.parent,'status')
                    #chk status function
                    if status == 'To Receive and Bill':
                        to_receive_count = to_receive_count + 1
                    elif status == 'To Bill':
                        to_bill_count = to_bill_count + 1
                    elif status == 'Completed':
                        paid_count = paid_count + 1
                    
                if to_receive_count > 0 or to_bill_count > 0 or paid_count > 0:
                    #changes in indent order status to partial
                    frappe.db.set_value('Indent',ind.indent_name,'order_status','Partially Ordered')
                    #changes in indent workflow_state status
                    frappe.db.set_value('Indent',ind.indent_name,'workflow_state','To Receive and Bill')
                elif to_receive_count == 0 or to_bill_count == 0 or paid_count == 0:
                    #changes in indent order status to fully
                    frappe.db.set_value('Indent',ind.indent_name,'order_status','Not Ordered')
                    frappe.db.set_value('Indent',ind.indent_name,'workflow_state','Approved')
                #frappe.db.set_value('Indent',ind.indent_name,'order_status','Not Ordered')
                #frappe.db.set_value('Indent',ind.indent_name,'workflow_state','Approved')

            elif doc.doctype == 'Purchase Receipt':
                purchase_order = frappe.db.get_all('Indent Details',{
                        'indent_name': ind.indent_name,
                        'docstatus': 1,
                        'parenttype': "Purchase Order"
                    },
                    ['parent']
                )
                to_receive_count= 0
                to_bill_count = 0
                paid_count = 0
                for po in purchase_order:
                    status = frappe.db.get_value('Purchase Order',po.parent,'status')
                    
                    #chk status function
                    if status == 'To Receive and Bill':
                        to_receive_count = to_receive_count + 1
                    elif status == 'To Bill':
                        to_bill_count = to_bill_count + 1
                    elif status == 'Paid':
                        paid_count = paid_count + 1
                
                if to_receive_count >= 1 and (to_bill_count > 0 or paid_count > 0):
                    frappe.db.set_value('Indent',ind.indent_name,'receive_status','Partially Received')
                elif to_receive_count >= 1 and (to_bill_count == 0 or paid_count == 0):
                    frappe.db.set_value('Indent',ind.indent_name,'receive_status','Not Received')
                    frappe.db.set_value('Indent',ind.indent_name,'workflow_state','To Receive and Bill')

            elif doc.doctype == 'Purchase Invoice':
                purchase_order = frappe.db.get_all('Indent Details',{
                        'indent_name': ind.indent_name,
                        'docstatus': 1,
                        'parenttype': "Purchase Order"
                    },
                    ['parent']
                )
                to_receive_count= 0
                to_bill_count = 0
                paid_count = 0
                completed = 0
                for po in purchase_order:
                    status = frappe.db.get_value('Purchase Order',po.parent,'status')
                    
                    #chk status function
                    if status == 'To Receive and Bill':
                        to_receive_count = to_receive_count + 1
                    elif status == 'To Bill':
                        to_bill_count = to_bill_count + 1
                    elif status == 'Paid':
                        paid_count = paid_count + 1
                    elif status == 'Completed':
                        completed = completed + 1
                
                if to_bill_count >= 1 and (to_receive_count > 0 or paid_count > 0 or completed > 0):
                    frappe.db.set_value('Indent',ind.indent_name,'billing_status','Partially Billed')
                    workflow_state = frappe.db.get_value('Indent',ind.indent_name,'workflow_state')
                    if workflow_state == 'Completed':
                        frappe.db.set_value('Indent',ind.indent_name,'workflow_state','To Bill')
                elif to_bill_count >= 1 and (to_receive_count == 0 or paid_count == 0 or completed == 0):
                    frappe.db.set_value('Indent',ind.indent_name,'billing_status','Not Billed')
                    workflow_state = frappe.db.get_value('Indent',ind.indent_name,'workflow_state')
                    if not workflow_state == 'To Receive and Bill':
                        frappe.db.set_value('Indent',ind.indent_name,'workflow_state','To Bill')
                #frappe.db.set_value('Indent',ind.indent_name,'billing_status','Not Billed')
                #frappe.db.set_value('Indent',ind.indent_name,'billing_status','To Bill')