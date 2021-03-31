/*
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

/**
 * Renders the callback URL for WebSub and URI mapping for WebSocket.
 *
 * @param {*} props
 */
export default function Runtime(props) {
    const {
        operation, operationsDispatcher, target, verb, api,
    } = props;

    const buildCallbackURL = () => {
        return `http://{GATEWAY_HOST}:9021/${api.context.toLowerCase()}/${api.version}/`
            + `webhooks_events_receiver_resource?topic=${target.toLowerCase()}`;
    };

    const getUriMappingHelperText = (value) => {
        let fqPath;
        if (api.endpointConfig
            && api.endpointConfig.production_endpoints
            && api.endpointConfig.production_endpoints.url
            && api.endpointConfig.production_endpoints.url.length > 0
            && value
            && value.length > 0) {
            // TODO: remove trailing '/' if available
            fqPath = api.endpointConfig.production_endpoints.url + value;
        }
        return fqPath ? 'Production URL will be ' + fqPath : '';
    };
    const [uriMappingHelperText, setUriMappingHelperText] = useState(
        getUriMappingHelperText(operation[verb]['x-uri-mapping']),
    );

    return (
        <>
            <Grid item xs={12} md={12}>
                <Typography variant='subtitle1'>
                    Runtime
                    <Divider variant='middle' />
                </Typography>
            </Grid>
            {api.type === 'WS' && (
                <>
                    <Grid item md={1} />
                    <Grid item md={5}>
                        <TextField
                            margin='dense'
                            fullWidth
                            label='URL Mapping'
                            value={operation[verb]['x-uri-mapping']}
                            variant='outlined'
                            helperText={uriMappingHelperText}
                            onChange={(e) => {
                                let { value } = e.target;
                                if (value.length > 0 && value.substr(0, 1) !== '/') {
                                    value = '/' + value;
                                }
                                setUriMappingHelperText(getUriMappingHelperText(value));
                                operationsDispatcher({ action: 'uriMapping', data: { target, verb, value } });
                            }}
                        />
                    </Grid>
                    <Grid item md={6} />
                </>
            )}
            {api.type === 'WEBSUB' && (
                <>
                    <Grid item md={1} />
                    <Grid item md={10}>
                        <TextField
                            margin='dense'
                            fullWidth
                            label='Callback URL'
                            disabled
                            value={buildCallbackURL()}
                            variant='outlined'
                        />
                    </Grid>
                    <Grid item md={1} />
                </>
            )}
        </>
    );
}

Runtime.propTypes = {
    operation: PropTypes.shape({
        target: PropTypes.string.isRequired,
        verb: PropTypes.string.isRequired,
        spec: PropTypes.shape({}).isRequired,
    }).isRequired,
    operationsDispatcher: PropTypes.func.isRequired,
    target: PropTypes.string.isRequired,
    verb: PropTypes.string.isRequired,
};
