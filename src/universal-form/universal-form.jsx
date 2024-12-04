import classes from './universal-form.module.css'

export function UniversalForm({header, width, children}) {
    return ( 
        <div className={classes.universalForm} style={{ '--user-width' : width}}>
            <h1 className={classes.header}>{header}</h1>
            <div className={classes.universalInputs}>
                {children}
            </div>
        </div> 
    )
}