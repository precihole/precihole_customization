frappe.listview_settings['Indent'] = {
    hide_name_column: true,
    add_fields: ["workflow_state"],
        get_indicator:function(doc){
            if(doc.workflow_state == 'Open'){
                return [__("Open"), "red"]
            }
        }
}