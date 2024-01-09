import ReportChecking from '../../../Users/SchoolAdmin/reportChecking'
import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('ReportChecking Component', () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('fetches report requests and renders them', async () => {
    // Mock successful fetch request for report requests
    fetchMock.get('shared/report', {
      body: [{ id: 1, title: 'Report 1', processed: false }],
      status: 200,
    });

    await act(async () => {
        render(
          <Router>
            <ReportChecking />
          </Router>
        );
    });

    // Ensure that the component renders
    const reportItem = screen.getByText('Report 1');
    expect(reportItem).toBeInTheDocument();
  });

  it('fetches reported conversation and displays it', async () => {
    // Mock successful fetch request for reported conversation
    fetchMock.get('shared/report/1', {
      body: { id: 1, conversation: 'Reported Conversation', processed: false },
      status: 200,
    });

    await act(async () => {
      render(
        <Router>
          <ReportChecking />
        </Router>
      );
    });

    // Click on a report to trigger fetching reported conversation
    const reportItem = screen.getByText('Report 1');
    act(async ()=> {
        fireEvent.click(reportItem);
    })

    // Ensure that the reported conversation is displayed
    const reportedConversation = screen.getByText('Reported Conversation');
    expect(reportedConversation).toBeInTheDocument();
  });

  it('handles report processing - validation', async () => {
    // Mock successful fetch request for processing report validation
    fetchMock.post('shared/report/1', {
      status: 200,
    });

    await act(async () => {
      render(
        <Router>
          <ReportChecking />
        </Router>
      );
    });

    // Click on a report to trigger validation
    const reportItem = screen.getByText('Report 1');
    act(async ()=> {
        fireEvent.click(reportItem);
    })

    // Click on the "Valider" button
    const validateButton = screen.getByText('Valider');
    act(async ()=> {
        fireEvent.click(validateButton);
    })

    // Ensure that the report is marked as processed
    await waitFor(() => {
      const processedStatus = screen.getByText('La demande a été traitée.');
      expect(processedStatus).toBeInTheDocument();
    });
  });

  it('handles report processing - deletion', async () => {
    // Mock successful fetch request for processing report deletion
    fetchMock.delete('shared/report/1', {
      status: 200,
    });

    await act(async () => {
      render(
        <Router>
          <ReportChecking />
        </Router>
      );
    });

    // Click on a report to trigger deletion
    const reportItem = screen.getByText('Report 1');
    act(async ()=> {
        fireEvent.click(reportItem);
    })

    // Click on the "Supprimer" button
    const deleteButton = screen.getByText('Supprimer');
    act(async ()=> {
        fireEvent.click(deleteButton);

    })
    // Ensure that the report is removed from the list
    await waitFor(() => {
      const reportItem = screen.queryByText('Report 1');
      expect(reportItem).not.toBeInTheDocument();
    });
  });

  it('handles filter change', async () => {
    // Mock successful fetch request for initial report requests
    fetchMock.get('shared/report', {
      body: [{ id: 1, title: 'Report 1', processed: false }],
      status: 200,
    });

    await act(async () => {
      render(
        <Router>
          <ReportChecking />
        </Router>
      );
    });

    // Ensure that the component renders with the initial report
    const reportItem = screen.getByText('Report 1');
    expect(reportItem).toBeInTheDocument();

    // Click on the "Traitées" button to change the filter
    const processedFilterButton = screen.getByText('Traitées');
    act(async ()=> {
        fireEvent.click(processedFilterButton);
    })

    // Ensure that the processed report is still rendered
    const reportItemAfterFilterChange = screen.getByText('Report 1');
    expect(reportItemAfterFilterChange).toBeInTheDocument();
  });

  it('handles error during report fetching', async () => {
    // Mock failed fetch request for report requests
    fetchMock.get('shared/report', {
      throws: new Error('Failed to fetch report requests'),
    });

    await act(async () => {
      render(
        <Router>
          <ReportChecking />
        </Router>
      );
    });

    // Ensure that the error message is displayed
    const errorMessage = screen.getByText('Erreur lors de la récupération des demandes de signalement.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('handles error during reported conversation fetching', async () => {
    // Mock successful fetch request for initial report requests
    fetchMock.get('shared/report', {
      body: [{ id: 1, title: 'Report 1', processed: false }],
      status: 200,
    });

    // Mock failed fetch request for reported conversation
    fetchMock.get('shared/report/1', {
      throws: new Error('Failed to fetch reported conversation'),
    });

    await act(async () => {
      render(
        <Router>
          <ReportChecking />
        </Router>
      );
    });

    // Click on a report to trigger reported conversation fetching
    const reportItem = screen.getByText('Report 1');
    act(async ()=> {
        fireEvent.click(reportItem);
    })

    // Ensure that the error message is displayed
    const errorMessage = screen.getByText('Erreur lors de la récupération de la conversation signalée.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('handles error during report processing', async () => {
    // Mock successful fetch request for initial report requests
    fetchMock.get('shared/report', {
      body: [{ id: 1, title: 'Report 1', processed: false }],
      status: 200,
    });

    // Mock failed fetch request for processing report
    fetchMock.post('shared/report/1', {
      throws: new Error('Failed to process report'),
    });

    await act(async () => {
      render(
        <Router>
          <ReportChecking />
        </Router>
      );
    });

    // Click on a report to trigger report processing
    const reportItem = screen.getByText('Report 1');
    act(async ()=> {
        fireEvent.click(reportItem);
    })

    // Click on the "Valider" button
    const validateButton = screen.getByText('Valider');
    act(async ()=> {
        fireEvent.click(validateButton);
    })

    // Ensure that the error message is displayed
    const errorMessage = screen.getByText("Erreur lors du traitement de la demande.");
    expect(errorMessage).toBeInTheDocument();
  });
});
