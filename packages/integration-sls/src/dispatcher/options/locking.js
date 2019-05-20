const LOCK_STATUS = {
    ACQUIRED: 'ACQUIRED',
    NOT_NEEDED: 'NOT_NEEDED',
    ALREADY_LOCKED: 'ALREADY_LOCKED',
    FAILURE: 'FAILURE'
};

const LOCK_STATE = {
    ACQUIRED: 'ACQUIRED',
    NOT_NEEDED: 'NOT_NEEDED',
    NOT_ACQURIED: 'NOT_ACQURIED'
};

module.exports.createLocking = () => ({
    acquireLock: (data) =>
    {
        return {
            success: true,
            payload: {
                status: LOCK_STATUS.ACQUIRED,
                time: 12345,
                id: 'test:12345'
            }
        };
    },
    getLockState: (data) =>
    {
        return LOCK_STATE.NOT_NEEDED;
    },
    releaseLock: (data) =>
    {
        return {
            success: true,
        };
    }
});
