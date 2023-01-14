# Copyright (c) 2022, Precihole and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ItemCodeRequest(Document):
    def before_submit(self):

        if self.workflow_state == "Created":
            if not self.new_item_code:
                frappe.throw("Item code is mandatory before submit")
            
        if self.new_item_code:
            self.requested_item_code = self.new_item_code
            
        if self.item_code_comments:
            self.comments_ro = self.item_code_comments