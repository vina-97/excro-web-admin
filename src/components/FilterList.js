import React, { useRef , useEffect, useCallback , useMemo , memo } from "react";
import Select from 'react-select';
import { DateRange } from 'react-date-range';

const FilterList = (props) => {


    const Duration_Filter = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: '3month', label: 'Last 3 Months' },
  /*       { value: '6month', label: 'Last 6 Months' },
        { value: 'year', label: 'Last year' } */
    ]

    const Contact_type = [
        { value: 'customer', label: 'Customer' },
        { value: 'merchant', label: 'Merchant' },
        { value: 'employee', label: 'Employee' },
        { value: 'vendor', label: 'Vendor' },
        { value: 'supplier', label: 'Supplier' }
    ]

    const Status_Filter = [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ]

    return (
        <>
            <div className="filers_parent_wrap">
                <div className="row">
                  
                    <div className="col-xs-12 col-sm-3">
                        <input className="fileter_form_input" placeholder="Search In..." type="text"  name={"searchTerm"}
                        value={props.searchTerm}
                        onChange={props.handleSearchChange} />
                    </div>
                    <div className="col-xs-12 col-sm-2">
                        <Select
                            value={Object.keys(props.selectedMerchant).length !== 0 && props.selectedMerchant}
                            onChange={props.handleChange}
                            options={props.merchantList}
                            menuIsOpen={props.isOpenMenu}
                            onMenuOpen={() => props.getMerchantList()}
                            onMenuClose={() => {props.onMenuClose();}}
                            isClearable={true}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3 text-right">
                        <a className="submitBtn m-l-15" data-toggle="modal" >Export</a>
                    </div>
                </div>                    
            </div>
            <div className="col-xs-12 m-b-30 p-0 more_filters_toggle">
                <label className="filter_label p-l-0">Dates</label> 
                <div className="col-xs-2 p-0">
                        
                        <input  type="text" className="fileter_form_input" placeholder="Start date ~ End date" 
                        onClick={() => props.openPicker()} defaultValue={props.from  ? `${props.from} ~ ${props.to}` : ""} />
                        {props.open_picker &&
                        <DateRange
                            months={2}
                            ranges={[props.selectionRange]}
                            onChange={(e) => props.dateChange(e)}
                            direction="horizontal"
                            maxDate={new Date()}
                            showMonthAndYearPickers={false}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            showPreview={false}
                            showDateDisplay={false}
                        />
                        }
                </div>
                <div className="col-xs-2 p-r-0">
                    <Select className="selectpicker"  options={Duration_Filter}  onChange={(e)=>props.selectFilter("selection",e)}   value={props.Selection !== undefined && props.Selection} />
                </div>
                <div className="col-xs-2 p-r-0">
                    <Select className="selectpicker"  options={Contact_type} onChange={(e)=>props.selectFilter("contact_type",e)}   value={props.ContactType !== undefined && props.ContactType} />
                </div>
                {
                    props.status_filter ? 
                    <div className="col-xs-2 p-r-0">
                        <Select className="selectpicker" title="Status" options={Status_Filter} onChange={(e)=>props.selectFilter("status",e)}   value={props.Status !== undefined && props.Status} /> 
                    </div>
                    : null
                }                    
                <a className="btn btn-default m-l-15" onClick={props.resetFilter}>Reset</a>
            </div>
        </>
    )
}


export default memo(FilterList);
