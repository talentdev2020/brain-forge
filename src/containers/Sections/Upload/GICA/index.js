import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Col, Divider, Form, Row, Switch } from 'antd'
import { get } from 'lodash'
import {
  listUploadableStudy,
  selectUploadableStudies,
  selectSitesStatus,
  LIST_UPLOADABLE_STUDY,
} from 'store/modules/sites'
import { initializeCurrentFiles, setAllFiles, setCurrentFiles, updateCurrentFileFields } from 'store/modules/datafiles'
import { DataFileTree, Loader, MetadataEditor } from 'components'
import { selectAnalysisType, selectAnalysis } from 'store/modules/analyses'

const { Item: FormItem } = Form

export const GroupICAUploadSection = props => {
  const {
    analysisType,
    analysis,
    updateCurrentFileFields,
    setAllFiles,
    setCurrentFiles,
    showSelector,
    sitesStatus,
  } = props

  const [dataOrder, setDataOrder] = useState([])
  const [isMetadataSelected, setIsMetadataSelected] = useState(false)

  const inputFile = get(analysis, 'parameters.analysis.options.files.value')

  const handleTreeChange = files => {
    setAllFiles(files)
    setCurrentFiles(files)
  }

  const loading = () => {
    return sitesStatus === LIST_UPLOADABLE_STUDY
  }

  if (loading()) {
    return <Loader />
  }

  return (
    <Row>
      <Col style={{ textAlign: 'right' }}>
        <Switch
          checkedChildren="GICA Metadata"
          unCheckedChildren="GICA Metadata"
          checked={isMetadataSelected}
          onChange={setIsMetadataSelected}
        />
      </Col>
      <Col>
        {isMetadataSelected && (
          <Fragment>
            <MetadataEditor
              allowedHeaders={['subject', 'session', 'series', 'datafile']}
              onChange={metadata => setDataOrder(get(metadata, 'results'))}
            />
            <Divider style={{ marginTop: 36 }} />
          </Fragment>
        )}
      </Col>
      {showSelector && (
        <Col>
          <FormItem
            label={`${isMetadataSelected ? 'And select' : 'Select'} a previously uploaded/output dataset:`}
            style={{ fontSize: 18 }}
          >
            <DataFileTree
              multiple
              dataOrder={dataOrder}
              analysisType={analysisType}
              analysis={analysis}
              initialValue={inputFile}
              onChange={handleTreeChange}
              onUpdateFields={updateCurrentFileFields}
            />
          </FormItem>
        </Col>
      )}
    </Row>
  )
}

GroupICAUploadSection.propTypes = {
  analysis: PropTypes.object,
  studies: PropTypes.array,
  sitesStatus: PropTypes.string,
  analysisType: PropTypes.object,
  showSelector: PropTypes.bool,
  listUploadableStudy: PropTypes.func,
  setAllFiles: PropTypes.func,
  setCurrentFiles: PropTypes.func,
  updateCurrentFileFields: PropTypes.func,
  initializeCurrentFiles: PropTypes.func,
}

GroupICAUploadSection.defaultProps = {
  showSelector: true,
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysisType: selectAnalysisType,
  studies: selectUploadableStudies,
  sitesStatus: selectSitesStatus,
})

const actions = {
  initializeCurrentFiles,
  listUploadableStudy,
  setCurrentFiles,
  setAllFiles,
  updateCurrentFileFields,
}

export default connect(
  selectors,
  actions,
)(GroupICAUploadSection)